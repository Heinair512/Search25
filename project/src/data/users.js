export const users = [
  { 
    name: 'Jörg Wehrenberg',
    email: 'Joerg.Wehrenberg@gc-gruppe.de', 
    password: '12345', 
    role: 'Admin',
    bu: ['GC Gruppe', 'GC', 'hti'],
    image: null
  },
  { 
    name: 'Steffen Giese',
    email: 'steffen.giese@example.com', 
    password: '12345', 
    role: 'Dev',
    bu: ['Search'],
    image: null
  },
  { 
    name: 'Heiner Holzhüter',
    email: 'heiner.holzhueter.extern@gc-gruppe.de', 
    password: '12345', 
    role: 'Admin',
    bu: ['Search', 'GC'],
    image: null
  },
  { 
    name: 'Krzysztof Michalak',
    email: 'kmichalak@grupa-hbh.pl', 
    password: '12345', 
    role: 'Analyst',
    bu: ['bimsplus'],
    image: null
  },
  // New OTP test accounts
  {
    name: 'OTP1',
    email: 'otp1.test@gc-gruppe.de',
    otp: 'ABC123',
    role: 'Admin',
    bu: ['GC Gruppe', 'Search'],
    image: null,
    needsPasswordReset: true
  },
  {
    name: 'OTP2',
    email: 'otp2.test@gc-gruppe.de',
    otp: 'DEF456',
    role: 'Dev',
    bu: ['Search', 'bimsplus'],
    image: null,
    needsPasswordReset: true
  },
  {
    name: 'OTP3',
    email: 'otp3.test@gc-gruppe.de',
    otp: 'GHI789',
    role: 'Analyst',
    bu: ['GC', 'hti'],
    image: null,
    needsPasswordReset: true
  },
  {
    name: 'OTP4',
    email: 'otp4.test@gc-gruppe.de',
    otp: 'JKL012',
    role: 'Dev',
    bu: ['bimsplus', 'Search'],
    image: null,
    needsPasswordReset: true
  }
];