import React from 'react';
import { render } from '@testing-library/react-native';

import { Input } from '.';

describe('Input Component', () => {
  it('must have specific border color when active', () =>{
    const { getByTestId} = render(
      <Input
        testID="input-email"
        placeholder="E-mail"
        keyboardType="email-address"
        autoCorrect={false}
        active={true}
      />
    );
  });
});