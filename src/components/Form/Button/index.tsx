import React from 'react';
import { RectButtonProperties } from 'react-native-gesture-handler'


import { Continer, Title} from './styles';

interface Props extends RectButtonProperties {
  title: string;
  onPress: () => void;
}

export function Button({
  title, 
  onPress,
  ...rest}: Props) {
  return (
    <Continer 
      onPress={onPress}
      { ...rest }
    >
      <Title>
        {title}
      </Title>
    </Continer>
  )
}