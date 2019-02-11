import djoser.email


class ActivationEmail(djoser.email.ActivationEmail):
    template_name = 'accounts/activation_email.html'


class ConfirmationEmail(djoser.email.ConfirmationEmail):
    template_name = 'accounts/confirmation_email.html'


class PasswordResetEmail(djoser.email.PasswordResetEmail):
    template_name = 'accounts/password_reset_email.html'
