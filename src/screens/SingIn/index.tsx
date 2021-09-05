import React, { useState } from 'react';
import { Alert, ActivityIndicator, Platform } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';

import { useAuth } from '../../hooks/auth';
import {  SingInSocialButton } from '../../components/SingInSocialButton';

import AppeSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SingInTitle,
  Footer,
  FooterWrapper,
} from './styles';

export function SingIn() {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle, signInWithApple } = useAuth();

  const theme = useTheme();

  async function handleSignInWithGoogle() {
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch(error) {
      console.log(error);
      Alert.alert('Não foi possível conect a conta google');
      setIsLoading(false);
    }
  }

  async function handleSignInWithApple() {
    try {
      setIsLoading(true);
      return await signInWithApple();
    } catch(error) {
      console.log(error);
      Alert.alert('Não foi possível conect a conta apple');
      setIsLoading(false);
    }
  }

  return(
    <Container>
      <Header>
        <TitleWrapper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />

          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        <SingInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SingInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          <SingInSocialButton 
            title="Entrar com google"
            svg={GoogleSvg}
            onPress={signInWithGoogle}
          />

          {Platform.OS === 'ios' &&
            <SingInSocialButton 
              title="Entrar com apple"
              svg={AppeSvg}
              onPress={signInWithApple}
            />
          }
        </FooterWrapper>
        {isLoading && 
          <ActivityIndicator
            color={theme.colors.shape}
            style={{marginTop: 18}}
          />
        }
      </Footer>
    </Container>
  );
}