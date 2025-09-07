class ValidatorSchema {
  public passwordValidator =
    {
      validator: function (value) {
        const regex = /^(?=.*[a-z]).{4,}$/;
        return regex.test(value);
      },
      message: 'Password must contain at least one lowercase letter, one uppercase letter, one special character, and be at least four characters long.'
    }

  public nameValidator = {
    validator: function (value) {
      const regex = /^[A-Za-z\s]+$/;
      return regex.test(value);
    },
    message: 'Name must contain only letters and spaces.'
  }

  public emailValidator = {
    validator: function (value) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(value);
    },
    message: 'Invalid email format.'
  };

}
export const validators = new ValidatorSchema();