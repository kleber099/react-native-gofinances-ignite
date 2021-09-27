import React from 'react';
import { render } from '@testing-library/react-native';

import { Profile } from '../../screens/Profile';

describe('Profile Screen', () => {
  it('should have placeholder correctly in user name inpuot.', () => {
    // printando o component Profile
    // const { debug } = render(<Profile />);
    // debug();
  
    //Recuperando detalhes do component
    // const { getByPlaceholderText } = render(<Profile />);
    // const inputName = getByPlaceholderText("Nome");
    // console.log(inputName);
  
    const { getByPlaceholderText } = render(<Profile />);
    const inputName = getByPlaceholderText("Nome");
    console.log("Valor do placeholder = ", inputName.props.placeholder);
  
    expect(inputName).toBeTruthy();
  });
  
  it('should be loaded user data', () => {
    const { getByTestId } = render(<Profile />);
  
    const inputName = getByTestId('input-name');
    const inputSurname = getByTestId('input-surname');
  
    expect(inputName.props.value).toEqual('Kleber');
    expect(inputSurname.props.value).toEqual('Mesquita');
  });
  
  it('should exists title correctly', () => {
    const { getByTestId } = render(<Profile />);
    const textTitle = getByTestId('text-title');
  
    expect(textTitle.props.children).toContain('Perfil');
  });
});