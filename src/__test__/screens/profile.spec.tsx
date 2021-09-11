import React from 'react';
import { render } from '@testing-library/react-native';

import { Profile } from '../../screens/Profile';

test('check if show correctly user input name placeholder', () => {
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