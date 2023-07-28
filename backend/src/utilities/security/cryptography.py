from Crypto.Cipher import AES, PKCS1_OAEP
from Crypto.PublicKey import RSA
import base64

import random

# Commented block is probably non-functional
#class Cipher:
#    
#    @staticmethod
#    def generate_key(length):
#        ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWYZ"
#        chars = []
#        for i in range(length):
#            chars.append(random.choice(ALPHABET))
#        return "".join(chars)
#    
#    
#    @staticmethod
#    def encrypt(key, text):
#        salt_len = 16 - len(text) % 16
#        salt = Cryptography.GenerateKey(salt_len)
#        
#        cipher = AES.new(key, AES.MODE_CBC, " is a 16 byte IV")
#        encrypted = cipher.encrypt(text + salt)
#        return salt, encrypted
#        
#    
#    @staticmethod
#    def decrypt(key, salt, encrypted):
#        cipher = AES.new(key, AES.MODE_CBC, " is a 16 byte IV")
#        decrypted = cipher.decrypt(encrypted)        
#        decrypted = decrypted[:-len(salt)]        
#        return decrypted     
        

class PubPvtKey:
    @staticmethod
    def generate_key_files(length=2048, directory="."):
        key = RSA.generate(length) # <class 'Crypto.PublicKey.RSA.RsaKey'>
        
        pvt_key = key.exportKey() # bytestring
        pub_key = key.publickey().exportKey() # bytestring
        # Export binary private and public key pair
        with open(f"{directory}/pvt.key", "w") as key_file:
            key_file.write(pvt_key.decode())
        
        with open(f"{directory}/pub.key", "w") as key_file:
            key_file.write(pub_key.decode())
    
    @staticmethod
    def encrypt(key, text):
        # key is the public key (string)
        # text is the encoded "username:password" (byte string)
        
        #key = RSA.importKey(key) #RSA key object
        #cipher = PKCS1_OAEP.new(key)
        #encrypted = cipher.encrypt(text) # returns a byte string
        #return encrypted
        return text
    
    @staticmethod
    def decrypt(key, encrypted):
        print(encrypted, " : ",type(encrypted))
        # key: private key (string)
        # encrypted: byste string represented as string
        #print("INSIDE PubPvtKey decryption:", type(encrypted),"TEXT", encrypted)

        #key = RSA.importKey(key)
        #cipher = PKCS1_OAEP.new(key)
        #decrypted = cipher.decrypt(encrypted)
        #decode = decrypted.decode()
        #return decode
        return encrypted
