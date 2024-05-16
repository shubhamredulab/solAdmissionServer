import session from 'express-session';

export const memoryStore = new session.MemoryStore();

const expressSession = session({
    secret: 'mySecret',
    resave: true,
    saveUninitialized: true,
    store: memoryStore
});




export default expressSession;
