import mongoose, { Connection } from 'mongoose';

type DBConnection = {
    isConnected: boolean;
  }

export const connectToDB = async ():Promise<Connection> => {
  const connection: DBConnection = {isConnected: false};
  try {
    if (connection.isConnected) return mongoose.connection;
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState === 1;
    return db.connection;
    
  } catch (error: any) {
    throw new Error(error);
  }
};
export abstract class MongoDbConnection {
    private connection: Connection | null = null;
    protected async connect(): Promise<void> {
        if (!this.connection) {
            try {
                this.connection = await connectToDB();
            } catch (error) {
                console.error("Failed to connect to the database:", error);
                throw new Error("Unable to establish database connection");
            }
        }
    }
    public async getConnection(): Promise<Connection> {
        if (!this.connection) {
            await this.connect();
        }
        if (!this.connection) {
            throw new Error("Database connection not established.");
        }
        return this.connection;
    }
}