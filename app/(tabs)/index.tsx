import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Alert } from 'react-native';

// Passo 1: Importamos nossas constantes do novo arquivo!
import { FOCUS_TIME_SECONDS, BREAK_TIME_SECONDS } from '../constants/times';

// O nome do componente agora é 'PomodoroScreen' ou simplesmente 'Screen', o que for mais semântico.
// 'export default' já torna ele a tela principal desta rota.
export default function PomodoroScreen() {
  // O resto da lógica permanece o mesmo...
  const [tempoRestante, setTempoRestante] = useState(FOCUS_TIME_SECONDS);
  const [estaAtivo, setEstaAtivo] = useState(false);
  const [ePeriodoFoco, setEPeriodoFoco] = useState(true);

  useEffect(() => {
    let intervalo: NodeJS.Timeout | null = null; // Adicionando tipo para TypeScript

    if (estaAtivo && tempoRestante > 0) {
      intervalo = setInterval(() => {
        setTempoRestante(tempo => tempo - 1);
      }, 1000);
    } else if (estaAtivo && tempoRestante === 0) {
      setEstaAtivo(false);
      Alert.alert(ePeriodoFoco ? "Hora da pausa!" : "De volta ao foco!");
      const novoPeriodoFoco = !ePeriodoFoco;
      setEPeriodoFoco(novoPeriodoFoco);
      setTempoRestante(novoPeriodoFoco ? FOCUS_TIME_SECONDS : BREAK_TIME_SECONDS);
    }

    // A função de limpeza precisa saber o tipo de 'intervalo'
    return () => {
      if (intervalo) {
        clearInterval(intervalo);
      }
    };
  }, [estaAtivo, tempoRestante]);

  const formatarTempo = (tempo: number) => { // Adicionando tipo para TypeScript
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
  };

  const alternarCronometro = () => {
    setEstaAtivo(!estaAtivo);
  };

  const reiniciarCronometro = () => {
    setEstaAtivo(false);
    setEPeriodoFoco(true);
    setTempoRestante(FOCUS_TIME_SECONDS);
  };

  return (
    <View style={[styles.container, { backgroundColor: ePeriodoFoco ? '#d95550' : '#4c9195' }]}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.textoTipoPeriodo}>{ePeriodoFoco ? 'Período de Foco' : 'Pausa'}</Text>
      <Text style={styles.textoCronometro}>{formatarTempo(tempoRestante)}</Text>
      
      <View style={styles.botoesContainer}>
        <TouchableOpacity style={styles.botao} onPress={alternarCronometro}>
          <Text style={styles.textoBotao}>{estaAtivo ? 'Pausar' : 'Iniciar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.botao, styles.botaoReiniciar]} onPress={reiniciarCronometro}>
          <Text style={styles.textoBotao}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Os estilos continuam os mesmos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoTipoPeriodo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  textoCronometro: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    fontFamily: 'monospace'
  },
  botoesContainer: {
    flexDirection: 'row',
  },
  botao: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  botaoReiniciar: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});