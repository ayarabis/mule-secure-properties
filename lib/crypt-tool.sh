#!/bin/bash

# -----------------------------------------------------------
# crypt-tool.sh
# -----------------------------------------------------------
# A bash script to encrypt/decrypt a string or file using
# the Secure Properties Tool.
# -----------------------------------------------------------
# Usage:
#   crypt-tool.sh <action> <algorithm> <mode> <key> <value> [<output>]
# -----------------------------------------------------------
# Options:
#   action: encrypt or decrypt
#   algorithm: AES, Blowfish, DES, DESede, RC2, RCA
#   mode: CBC, CFB, OFB, ECB
#   key: the key to use for encryption/decryption
#   value: the value to encrypt/decrypt
#   output: the file to write the encrypted/decrypted value to
# -----------------------------------------------------------
# Examples:
#   crypt-tool.sh encrypt AES CBC mykey myvalue
#   crypt-tool.sh decrypt AES CBC mykey myvalue
#   crypt-tool.sh encrypt AES CBC mykey myvalue myoutput.txt
#   crypt-tool.sh decrypt AES CBC mykey myvalue myoutput.txt
# -----------------------------------------------------------

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

ACTION=$1
ALGORITHM=$2
MODE=$3
KEY=$4
VALUE=$5
OUTPUT=$6

# if OUTPUT is provided, then write to file
if [ -n "$OUTPUT" ]; then
    java -cp $SCRIPT_DIR/secure-properties-tool.jar com.mulesoft.tools.SecurePropertiesTool \
        file \
        $ACTION \
        $ALGORITHM \
        $MODE \
        $KEY \
        $VALUE \
        $OUTPUT
    cat $OUTPUT
fi

java -cp $SCRIPT_DIR/secure-properties-tool.jar com.mulesoft.tools.SecurePropertiesTool \
string \
$ACTION \
$ALGORITHM \
$MODE \
$KEY \
$VALUE
