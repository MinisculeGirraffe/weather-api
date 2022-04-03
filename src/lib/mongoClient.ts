import {MongoClient} from 'mongodb'

const url = `mongodb://${process.env.MongoHost || 'localhost'}:${process.env.MongoPort || 27017}`
export const client = new MongoClient(url)

