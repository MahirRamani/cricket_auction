import 'next-auth'
import User from '@/models/User';


declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        mobileNumber?: string;
        isCricketSelected?: boolean;
        isAccepingMessage?: boolean;
    }

    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            mobileNumber?: string;
            isCricketSelected?: boolean;
        } & DefaultSession['user'];
    }
}


declare module "next-auth/jwt" {
    interface JWT {
        _id?: string;
        isVerified?: boolean;
        mobileNumber?: string;
        isCricketSelected?: boolean;
    }
}