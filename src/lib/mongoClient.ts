import {MongoClient} from 'mongodb'

const url = `mongodb://${process.env.MONGOHOST || 'localhost'}:${process.env.MONGOPORT || 27017}`
export const client = new MongoClient(url)