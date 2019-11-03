import * as React from 'react';
import Auth from '@aws-amplify/auth';
import { render, cleanup, fireEvent, act, wait } from '@testing-library/react';
import { SignIn } from '../sign-in';
import { AuthContext } from '../auth-context';

describe('sign-in', () => {
    const handleStateChange = jest.fn();

    const withContext = component => (
        <AuthContext.Provider
            value={{ authState: 'signIn', onStateChange: handleStateChange }}
        >
            {component}
        </AuthContext.Provider>
    );

    beforeEach(() => cleanup());

    it('should be rendered correctly in the signIn authState', () => {
        const { asFragment } = render(withContext(<SignIn />));
        expect(asFragment()).toMatchSnapshot();
    });

    it('it should change state to requireNewPassword if challengeName equals NEW_PASSWORD_REQUIRED', async () => {
        jest.spyOn(Auth, 'signIn').mockImplementationOnce(() => {
            return new Promise(res =>
                res({
                    challengeName: 'NEW_PASSWORD_REQUIRED',
                }),
            );
        });

        const { getByTestId, getByLabelText } = render(withContext(<SignIn />));

        const usernameInput = getByLabelText('Username', {
            exact: false,
            selector: 'input',
        });

        const passwordInput = getByLabelText('Password', {
            exact: false,
            selector: 'input',
        });

        act(() => {
            fireEvent.change(usernameInput, {
                target: { value: 'test@test.de' },
            });

            fireEvent.change(passwordInput, {
                target: { value: 'Qwertz123!' },
            });

            fireEvent.click(getByTestId('signInSubmit'));
        });

        await wait(() => {
            expect(handleStateChange).toHaveBeenCalledTimes(1);
            expect(handleStateChange).toHaveBeenCalledWith(
                'requireNewPassword',
                {
                    challengeName: 'NEW_PASSWORD_REQUIRED',
                },
            );
        });
    });
});