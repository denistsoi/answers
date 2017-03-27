# q1

Build a mobile application (which can be run on ios/android simulator).

### project directory

    /reactNative  // react-native 
    twilio.js     // use twilio lookup to determine phone number format
    readme.md

### How to use

    git clone 
    cd tbv-challenge-q1/reactNative
    npm install
    npm start

### Dependences

    - [ ] node
    - [ ] react-native cli (npm install)
    - [ ] watchman (brew install)

### Investigation

#### Existing Libraries  
[Node Google Phone Number Port](https://www.npmjs.com/package/libphonenumber)  
[Twilio Client](https://www.npmjs.com/package/twilio)

#### Conventions to writing phone numbers 
[Wiki](https://en.wikipedia.org/wiki/National_conventions_for_writing_telephone_numbers)

#### Country Codes 

- Overview [Wiki](https://en.wikipedia.org/wiki/List_of_country_calling_codes)  
- UK Telephone Numbers[Wiki](https://en.wikipedia.org/wiki/Telephone_numbers_in_the_United_Kingdom)  
- List of World Mobile Patterns [Wiki](https://en.wikipedia.org/wiki/List_of_mobile_phone_number_series_by_country#United_Kingdom)  

#### E.123 vs E.164 numbering standards;

[E164](https://en.wikipedia.org/wiki/E.164)  

### Todo 

- [x] install react native contacts [repo](https://github.com/rt2zz/react-native-contacts)  
- [x] add sources for sample telephone numbers  
- [ ] integrate contacts list on render    
- [ ] add UI on launch (number input)  
- [ ] add geolocation detection for on launch (default non-country codes to current location) 
- [ ] determine mobile number set (and parse accordingly)

### Author
Denis Tsoi <denistsoi@gmail.com>