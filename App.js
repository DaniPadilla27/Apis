import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator, Image, TouchableOpacity } from 'react-native';

const App = () => {
  const [pokemon, setPokemon] = useState(null);
  const [load, setLoad] = useState(true);
  const [descripcion, setDescripcion] = useState('');
  const [evolution, setEvolution] = useState('');

  useEffect(() => {
    const obtenerPokemonAleatorio = async () => {
      const randomId = Math.floor(Math.random() * 898) + 1;
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const pokemonData = await res.json();
        setPokemon(pokemonData);

        const resDescripcion = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomId}`);
        const speciesData = await resDescripcion.json();
        const descripcionEncontrada = speciesData.flavor_text_entries.find(entry => entry.language.name === 'es');
        setDescripcion(descripcionEncontrada.flavor_text);

        const evolutionChainRes = await fetch(speciesData.evolution_chain.url);
        const evolutionChainData = await evolutionChainRes.json();
        const evolutionChain = getEvolutionChain(evolutionChainData.chain);
        setEvolution(evolutionChain);

        setLoad(false);
      } catch (error) {
        console.error(error);
        Alert.alert('Ocurrió un error');
        setLoad(false);
      }
    };

    obtenerPokemonAleatorio();
  }, []);

  const getEvolutionChain = (chain) => {
    let evolutionChain = [];
    while (chain) {
      evolutionChain.push(chain.species.name);
      chain = chain.evolves_to[0];
    }
    return evolutionChain.join(' -> ');
  };

  const screenLoaded = () => {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.card}>
          <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
          <Text style={styles.title}>Nombre: {pokemon.name}</Text>
          <Text style={styles.info}>Altura: {pokemon.height}</Text>
          <Text style={styles.info}>Peso: {pokemon.weight}</Text>
          <Text style={styles.info}>Tipo: {pokemon.types.map(type => type.type.name).join(', ')}</Text>
          <Text style={styles.description}>Descripción: {descripcion}</Text>
          <Text style={styles.description}>Cadena de Evolución: {evolution}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const screenLoading = () => {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Cargando Datos...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {load ? screenLoading() : screenLoaded()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    alignSelf: 'center',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default App;
