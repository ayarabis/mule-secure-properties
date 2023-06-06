# Mule Secure Properties

## Overview

The Mule Secure Properties extension is a powerful tool for encrypting and decrypting secure properties quickly and conveniently within Visual Studio Code. With the help of Code Lens, it provides seamless integration and allows you to encrypt and decrypt properties directly from your code. The extension also includes features to persist encryption settings on a per-file basis, visually indicate insecure unencrypted properties, and customize the default encryption algorithm and mode.

## Features

### Encrypt and Decrypt Properties with Code Lens

The Mule Secure Properties extension enhances your development workflow by offering Code Lens actions for encrypting and decrypting secure properties. Code Lens displays these actions directly in your code, allowing you to easily encrypt or decrypt properties without leaving the editor.

### Per-File Encryption Settings Persistence

This extension ensures that your encryption settings are persisted on a per-file basis. This means that once you encrypt or decrypt a secure property within a file, the extension will remember your choice and apply it consistently. You no longer need to repeat the process every time you open the file.

### Visual Indication of Insecure Unencrypted Properties

To assist you in identifying unencrypted properties within your code, the Mule Secure Properties extension displays an icon in the editor gutter for any insecure unencrypted properties. This helps you quickly locate and address potential security vulnerabilities in your application.

### Customizable Default Encryption Algorithm and Mode

The extension allows you to customize the default encryption algorithm and mode to suit your preferences. You can configure the extension to use your preferred encryption algorithm and mode as the default choice for encrypting new secure properties. This feature provides flexibility and enables you to align the extension with your specific security requirements.

## Installation

1. Launch Visual Studio Code.
2. Go to the Extensions view by clicking on the square icon on the sidebar or by pressing `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS).
3. Search for "Mule Secure Properties" in the extensions marketplace.
4. Click on the "Install" button for the "Mule Secure Properties" extension by "CodeButter"
5. Once installed, the extension will be ready to use.

## Usage

1. Open any .properties file containing "secure" on it's name.
2. Locate a property that you want to encrypt or decrypt.
3. Look for the Code Lens action indicators above the property.
4. Click on the "Encrypt" action to encrypt the property or the "Decrypt" action to decrypt it.
5. The extension will perform the encryption or decryption and update the property in your code.
6. If necessary, customize the default encryption algorithm and mode by accessing the extension settings.

## Configuration

To customize the default encryption algorithm and mode, follow these steps:

1. Go to Visual Studio Code's settings by clicking on the gear icon on the sidebar or by pressing `Ctrl+,` (Windows/Linux) or `Cmd+,` (macOS).
2. Search for "Mule Secure Properties" in the settings search bar.
3. Adjust the "Default Encryption Algorithm" and "Default Encryption Mode" settings to your preferred values.
4. The extension will now use your customized default settings when encrypting new secure properties.

## Feedback and Support

If you encounter any issues, have suggestions for improvements, or need support, please don't hesitate to reach out. You can report issues or contribute to the development of the extension on the [GitHub repository](https://github.com/yourcompany/mule-secure-properties). We appreciate your feedback and will strive to address any concerns promptly.

## License

The Mule Secure Properties extension is open source and released under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use, modify, and distribute this extension in accordance with the
