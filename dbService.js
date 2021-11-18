const mysql = require('mysql');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
})

connection.connect((err) => {
    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
})

class DBService {
    static getDBServiceInstance() {
        return instance ? instance : new DBService();
    }

    async getByUser(name) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = 'SELECT * FROM services WHERE owner_name=?'
                connection.query(query, [name], (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            })
            return response;
        } catch (err) {
            console.log(err);
        }
    }

    async insertNewService(name, location, menu, price, owner_name) {
        try {
            const dateAdded = new Date();
            const response = await new Promise((resolve, reject) => {
                const query = "INSERT INTO services (service_name,location,menu,price,owner_name) VALUES (?,?,?,?,?);";
                connection.query(query, [name, location, menu, price, owner_name], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            })
            return response === 1 ? true : false
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async deleteServiceById(id) {
        id = parseInt(id, 10);
        console.log(id);
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM services WHERE id = ?";
                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            })
            return response === 1 ? true : false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async updateServiceById(id, new_name, new_location, new_menu, new_price) {
        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE services SET service_name = ?, location=?, menu = ?, price = ? WHERE id = ?";

                connection.query(query, [new_name, new_location, new_menu, new_price, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async searchByLocation(location) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * from services WHERE location=?";
                connection.query(query, [location], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            })
            return response;
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = DBService;