import connectDB from './dbConfig.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const setupRoles = async () => {
    await connectDB();

    // Function to hash user passwords
    const hashUserPasswords = async (users) => {
        return Promise.all(
            users.map(async (user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
                return user;
            })
        );
    };

    // Function to prepare users to match the schema
    const prepareUsers = (users) => {
        return users.map((user) => ({
            ...user,
            role:new mongoose.Types.ObjectId(user.role), // Convert role to ObjectId
            dob: new Date(user.dob), // Convert dob to Date object
        }));
    };

    const users = [
        {
            "username": "alialhammoud",
            "password": "avc@03867194",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "03867194",
            "status": "active",
            "shiftDays": [
                "thursday",
                "friday"
            ],
            "dob": "1998-06-08 00:00:00",
            "badleSize": "l",
            "kanzeSize": "m",
            "rangerSize": 42
        },
        {
            "username": "husseinfakih",
            "password": "avc@81014836",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O-",
            "phone": "81014836",
            "status": "active",
            "shiftDays": [
                "monday",
                "tuesday"
            ],
            "dob": "2006-01-21 00:00:00",
            "badleSize": "m",
            "kanzeSize": "xl",
            "rangerSize": 42
        },
        {
            "username": "haidaribrahim",
            "password": "avc@71407217",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "71407217",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "2003-09-04 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 42
        },
        {
            "username": "ahmadkobaissi",
            "password": "avc@76880482",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "76880482",
            "status": "active",
            "shiftDays": [
                "friday"
            ],
            "dob": "2003-08-08 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 43
        },
        {
            "username": "basselalfares",
            "password": "avc@70626492",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "70626492",
            "status": "active",
            "shiftDays": [
                "friday"
            ],
            "dob": "2006-08-24 00:00:00",
            "badleSize": "xxl",
            "kanzeSize": "xxl",
            "rangerSize": 45
        },
        {
            "username": "hassanrida",
            "password": "avc@78897868",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "B+",
            "phone": "78897868",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "2004-05-25 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "m",
            "rangerSize": 42
        },
        {
            "username": "jaafarosaily",
            "password": "avc@76040202",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "76040202",
            "status": "active",
            "shiftDays": [
                "friday"
            ],
            "dob": "2002-04-07 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 41
        },
        {
            "username": "aliimadassi",
            "password": "avc@03036166",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "03036166",
            "status": "active",
            "shiftDays": [
                "wednesday"
            ],
            "dob": "2004-09-30 00:00:00",
            "badleSize": "xxl",
            "kanzeSize": "xl",
            "rangerSize": 46
        },
        {
            "username": "mahdikobeissy",
            "password": "avc@76735712",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A-",
            "phone": "76735712",
            "status": "active",
            "shiftDays": [
                "friday"
            ],
            "dob": "2005-01-28 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 44
        },
        {
            "username": "moussakobaissi",
            "password": "avc@81763592",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "81763592",
            "status": "active",
            "shiftDays": [
                "sunday"
            ],
            "dob": "2002-08-01 00:00:00",
            "badleSize": "s",
            "kanzeSize": "s",
            "rangerSize": 41
        },
        {
            "username": "husseinraad",
            "password": "avc@76638660",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "76638660",
            "status": "active",
            "shiftDays": [
                "thursday",
                "friday"
            ],
            "dob": "1998-07-01 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 43
        },
        {
            "username": "hadiassi",
            "password": "avc@76779485",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "76779485",
            "status": "active",
            "shiftDays": [
                "thursday"
            ],
            "dob": null,
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 41
        },
        {
            "username": "alimohamadmansour",
            "password": "avc@76818690",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "76818690",
            "status": "active",
            "shiftDays": [
                "wednesday"
            ],
            "dob": "1998-06-17 00:00:00",
            "badleSize": "s",
            "kanzeSize": "m",
            "rangerSize": 41
        },
        {
            "username": "jawadroumi",
            "password": "avc@76019682",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "B+",
            "phone": "76019682",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "2024-10-04 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 42
        },
        {
            "username": "ahmadjomaa",
            "password": "avc@76920892",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "76920892",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "1985-06-08 00:00:00",
            "badleSize": "xxl",
            "kanzeSize": "xxl",
            "rangerSize": 44
        },
        {
            "username": "mhamadsafawi",
            "password": "avc@71426472",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "71426472",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "2007-03-02 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 43
        },
        {
            "username": "alikobeissi",
            "password": "avc@71148599",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "B+",
            "phone": "71148599",
            "status": "active",
            "shiftDays": [
                "sunday"
            ],
            "dob": "2008-05-03 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 41
        },
        {
            "username": "hasanaliassy",
            "password": "avc@78917492",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "78917492",
            "status": "active",
            "shiftDays": [
                "thursday"
            ],
            "dob": "2006-06-27 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 43
        },
        {
            "username": "hadibilalassi",
            "password": "avc@81890343",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "AB+",
            "phone": "81890343",
            "status": "active",
            "shiftDays": [
                "friday"
            ],
            "dob": "2006-05-05 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 41
        },
        {
            "username": "alaalhaj",
            "password": "avc@71379818",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "71379818",
            "status": "active",
            "shiftDays": [
                "sunday"
            ],
            "dob": "1995-01-01 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 41
        },
        {
            "username": "mohamadsheikhali",
            "password": "avc@78832862",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "B+",
            "phone": "78832862",
            "status": "active",
            "shiftDays": [
                "monday",
                "tuesday",
                "wednesday",
                "sunday"
            ],
            "dob": "2006-06-07 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 42
        },
        {
            "username": "mohsenhachem",
            "password": "avc@71599396",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "71599396",
            "status": "active",
            "shiftDays": [
                "thursday"
            ],
            "dob": "2005-08-08 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xxl",
            "rangerSize": 44
        },
        {
            "username": "mohammadabbaskobayssi",
            "password": "avc@81749615",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "81749615",
            "status": "active",
            "shiftDays": [
                "monday",
                "tuesday",
                "sunday"
            ],
            "dob": null,
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 42
        },
        {
            "username": "jawadkhalilassi",
            "password": "avc@78940332",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "AB+",
            "phone": "78940332",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "2006-05-23 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 44
        },
        {
            "username": "hassanshaaytani",
            "password": "avc@76551728",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O-",
            "phone": "76551728",
            "status": "active",
            "shiftDays": [
                "wednesday"
            ],
            "dob": "2002-05-04 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 42
        },
        {
            "username": "mohmadalhamoud",
            "password": "avc@71172756",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "AB+",
            "phone": "71172756",
            "status": "active",
            "shiftDays": [
                "thursday"
            ],
            "dob": "2007-08-21 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 43
        },
        {
            "username": "aliahmadbarbeesh",
            "password": "avc@76917455",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "B+",
            "phone": "76917455",
            "status": "active",
            "shiftDays": [
                "monday",
                "saturday"
            ],
            "dob": "2006-06-06 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 43
        },
        {
            "username": "hassanalijaffal",
            "password": "avc@81697531",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "81697531",
            "status": "active",
            "shiftDays": [
                "thursday"
            ],
            "dob": "2003-12-31 00:00:00",
            "badleSize": "xxxl",
            "kanzeSize": "xxxl",
            "rangerSize": 43
        },
        {
            "username": "alisafawi",
            "password": "avc@76010966",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "76010966",
            "status": "active",
            "shiftDays": [
                "friday"
            ],
            "dob": "2002-03-02 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "l",
            "rangerSize": 44
        },
        {
            "username": "zeinyaghi",
            "password": "avc@81232921",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "81232921",
            "status": "active",
            "shiftDays": [
                "monday",
                "tuesday",
                "sunday"
            ],
            "dob": "2005-09-13 00:00:00",
            "badleSize": "l",
            "kanzeSize": "m",
            "rangerSize": 42
        },
        {
            "username": "mohammadfayad",
            "password": "avc@76028948",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "76028948",
            "status": "active",
            "shiftDays": [
                "thursday"
            ],
            "dob": "1995-03-13 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 45
        },
        {
            "username": "mhmadhusseinshaaban",
            "password": "avc@78975918",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "78975918",
            "status": "active",
            "shiftDays": [
                "monday",
                "tuesday",
                "sunday"
            ],
            "dob": null,
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 41
        },
        {
            "username": "tahazahwe",
            "password": "avc@78868317",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "78868317",
            "status": "active",
            "shiftDays": [
                "monday",
                "tuesday"
            ],
            "dob": "2001-12-22 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 45
        },
        {
            "username": "abbaschaitani",
            "password": "avc@71047757",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "71047757",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "1998-04-27 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 41
        },
        {
            "username": "mahmouddarwiesh",
            "password": "avc@81951237",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "81951237",
            "status": "active",
            "shiftDays": [
                "tuesday"
            ],
            "dob": "2024-12-23 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 41
        },
        {
            "username": "hadisheikhali",
            "password": "avc@71563475",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "71563475",
            "status": "active",
            "shiftDays": [
                "thursday"
            ],
            "dob": "2003-01-16 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 45
        },
        {
            "username": "haydarjaber",
            "password": "avc@70661078",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A-",
            "phone": "70661078",
            "status": "active",
            "shiftDays": [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday"
            ],
            "dob": "1994-11-02 00:00:00",
            "badleSize": "xxl",
            "kanzeSize": "xxl",
            "rangerSize": 43
        },
        {
            "username": "mohamadahmadshaaban",
            "password": "avc@76082750",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "AB+",
            "phone": "76082750",
            "status": "active",
            "shiftDays": [
                "friday"
            ],
            "dob": "2007-06-25 00:00:00",
            "badleSize": "xxl",
            "kanzeSize": "xxl",
            "rangerSize": 47
        },
        {
            "username": "khaledassi",
            "password": "avc@70827603",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "70827603",
            "status": "active",
            "shiftDays": [
                "thursday"
            ],
            "dob": "2007-07-12 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 45
        },
        {
            "username": "alihassanwehbi",
            "password": "avc@78824057",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "78824057",
            "status": "active",
            "shiftDays": [
                "friday"
            ],
            "dob": "2007-06-16 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 44
        },
        {
            "username": "mohammadhashem",
            "password": "avc@71209085",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "71209085",
            "status": "active",
            "shiftDays": [
                "sunday"
            ],
            "dob": "1986-04-26 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 44
        },
        {
            "username": "hassanmahmoudassi",
            "password": "avc@70682878",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A-",
            "phone": "70682878",
            "status": "active",
            "shiftDays": [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday"
            ],
            "dob": "1989-07-01 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 44
        },
        {
            "username": "mostafashaaban",
            "password": "avc@70790217",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "70790217",
            "status": "active",
            "shiftDays": [
                "monday"
            ],
            "dob": "2024-12-12 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 42
        },
        {
            "username": "alimohamadlhaf",
            "password": "avc@76736702",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "B+",
            "phone": "76736702",
            "status": "active",
            "shiftDays": [
                "thursday"
            ],
            "dob": "2006-06-18 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 43
        },
        {
            "username": "husseinmostafaraad",
            "password": "avc@76827674",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "76827674",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "2005-03-21 00:00:00",
            "badleSize": "m",
            "kanzeSize": "l",
            "rangerSize": 40
        },
        {
            "username": "mohamadalhamoud",
            "password": "avc@71041540",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "71041540",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "2007-10-09 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 42
        },
        {
            "username": "jawadsheikhali",
            "password": "avc@71285607",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "71285607",
            "status": "active",
            "shiftDays": [
                "friday"
            ],
            "dob": "2007-02-20 00:00:00",
            "badleSize": "xxl",
            "kanzeSize": "xl",
            "rangerSize": 45
        },
        {
            "username": "karimassi",
            "password": "avc@76967268",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "76967268",
            "status": "active",
            "shiftDays": [
                "wednesday"
            ],
            "dob": "2006-06-16 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "l",
            "rangerSize": 44
        },
        {
            "username": "fadelalhamoud",
            "password": "avc@70040477",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "70040477",
            "status": "active",
            "shiftDays": [
                "thursday"
            ],
            "dob": "1999-10-04 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 41
        },
        {
            "username": "ahmadraad",
            "password": "avc@81659006",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "81659006",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "2001-08-30 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 41
        },
        {
            "username": "mohamadahmad",
            "password": "avc@81667477",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "81667477",
            "status": "active",
            "shiftDays": [
                "monday",
                "tuesday",
                "wednesday",
                "friday",
                "sunday"
            ],
            "dob": "2002-10-13 00:00:00",
            "badleSize": "xxl",
            "kanzeSize": "xxl",
            "rangerSize": 43
        },
        {
            "username": "abdlmhsnassi",
            "password": "avc@81973709",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "81973709",
            "status": "active",
            "shiftDays": [
                "wednesday"
            ],
            "dob": "2001-10-29 00:00:00",
            "badleSize": "l",
            "kanzeSize": "m",
            "rangerSize": 43
        },
        {
            "username": "rajikadi",
            "password": "avc@78980138",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "78980138",
            "status": "active",
            "shiftDays": [
                "sunday"
            ],
            "dob": "1993-11-25 00:00:00",
            "badleSize": "xxl",
            "kanzeSize": "xxl",
            "rangerSize": 43
        },
        {
            "username": "karimjaffal",
            "password": "avc@71233417",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "71233417",
            "status": "active",
            "shiftDays": [
                "wednesday"
            ],
            "dob": "2002-09-29 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 42
        },
        {
            "username": "husseinfayez",
            "password": "avc@71265716",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O+",
            "phone": "71265716",
            "status": "active",
            "shiftDays": [
                "wednesday"
            ],
            "dob": "2004-01-23 00:00:00",
            "badleSize": "xxl",
            "kanzeSize": "xl",
            "rangerSize": 44
        },
        {
            "username": "youssefalsheikhali",
            "password": "avc@78913458",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "AB+",
            "phone": "78913458",
            "status": "active",
            "shiftDays": [
                "monday",
                "tuesday"
            ],
            "dob": "1996-07-02 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xxl",
            "rangerSize": 43
        },
        {
            "username": "issamchaitani",
            "password": "avc@76330280",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "B+",
            "phone": "76330280",
            "status": "active",
            "shiftDays": [
                "monday"
            ],
            "dob": "1985-05-18 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xxl",
            "rangerSize": 43
        },
        {
            "username": "khodoralhadi",
            "password": "avc@70853430",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "B+",
            "phone": "70853430",
            "status": "active",
            "shiftDays": [
                "sunday"
            ],
            "dob": "1996-02-21 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 41
        },
        {
            "username": "hassanmasri",
            "password": "avc@76821891",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "76821891",
            "status": "active",
            "shiftDays": [
                "friday"
            ],
            "dob": "2001-12-01 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 43
        },
        {
            "username": "hassanassi",
            "password": "avc@76072134",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "76072134",
            "status": "active",
            "shiftDays": [
                "friday"
            ],
            "dob": "2004-06-14 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 42
        },
        {
            "username": "karimsalloum",
            "password": "avc@71483803",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "71483803",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "2006-01-10 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 41
        },
        {
            "username": "alimahmoudassi",
            "password": "avc@78847885",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "78847885",
            "status": "active",
            "shiftDays": [
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday"
            ],
            "dob": "1988-04-17 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 43
        },
        {
            "username": "alimasri",
            "password": "avc@71409641",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A-",
            "phone": "71409641",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "1993-07-14 00:00:00",
            "badleSize": "xl",
            "kanzeSize": "xl",
            "rangerSize": 46
        },
        {
            "username": "mohammadnazirchaaban",
            "password": "avc@76068430",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "76068430",
            "status": "active",
            "shiftDays": [
                "wednesday",
                "thursday"
            ],
            "dob": "2006-01-02 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 43
        },
        {
            "username": "jaafarsafawi",
            "password": "avc@76774805",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "76774805",
            "status": "active",
            "shiftDays": [
                "tuesday"
            ],
            "dob": "2002-02-22 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 43
        },
        {
            "username": "hadidirani",
            "password": "avc@76714417",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "B+",
            "phone": "76714417",
            "status": "active",
            "shiftDays": [
                "thursday"
            ],
            "dob": "1998-03-16 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 42
        },
        {
            "username": "mhmdyasser",
            "password": "avc@76627520",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "O-",
            "phone": "76627520",
            "status": "active",
            "shiftDays": [
                "saturday"
            ],
            "dob": "2003-06-06 00:00:00",
            "badleSize": "m",
            "kanzeSize": "m",
            "rangerSize": 44
        },
        {
            "username": "ahmadshaitani",
            "password": "avc@76106887",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A-",
            "phone": "76106887",
            "status": "active",
            "shiftDays": [
                "sunday"
            ],
            "dob": "2006-08-07 00:00:00",
            "badleSize": "s",
            "kanzeSize": "m",
            "rangerSize": 43
        },
        {
            "username": "mohamadraad",
            "password": "avc@71260141",
            "role": "6687b7a86465f117840484ac",
            "profileImage": "",
            "bloodType": "A+",
            "phone": "71260141",
            "status": "active",
            "shiftDays": [
                "wednesday"
            ],
            "dob": "1993-05-19 00:00:00",
            "badleSize": "l",
            "kanzeSize": "l",
            "rangerSize": 42
        }
    ]

    try {
        // Prepare and hash user data
        const preparedUsers = prepareUsers(users);
        const hashedUsers = await hashUserPasswords(preparedUsers);

        // Insert users into the database
        const result = await User.insertMany(hashedUsers);
        console.log(`${result.length} users inserted successfully`);
    } catch (error) {
        console.error("Error inserting users:", error.message);
    } finally {
        process.exit();
    }
};

export default setupRoles;