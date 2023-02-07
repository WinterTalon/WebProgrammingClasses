const pool = require("../config/connection");

class Card {
    constructor(id,name,url,lore,description, level, 
                cost, timeout, maxUsage, type) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.lore = lore;
        this.description = description;
        this.level = level;
        this.cost = cost;
        this.timeout = timeout;
        this.maxUsage = maxUsage;
        this.type = type;
    }

    //Get all cards
    static async getAll() {
        try {
            let result = [];
            let [cards,fields] = await pool.query("Select * from cards");
            for(let card of cards ){
                result.push(new Card(card.crd_id,card.crd_name, 
                    card.crd_img_url, card.crd_lore, card.crd_description,
                    card.crd_level, card.crd_cost, card.crd_timeout,
                    card.crd_max_usage, card.crd_type));
            }
            return {status: 200, result: result};
        } catch (err) {
            console.log(err);
            return {status: 500, result: err };
        }
    }

    //Get card by id
    static async getById(id) {
        try{
            let result;
            let [card,fields] = await pool.query("Select * from cards where crd_id =?",[id]);
            if (card.length==0)
                  return {status:404, result: {msg: "No card found with that identifier"}};

            result = new Card(card[0].crd_id,card[0].crd_name, 
                card[0].crd_img_url, card[0].crd_lore, card[0].crd_description,
                card[0].crd_level, card[0].crd_cost, card[0].crd_timeout,
                card[0].crd_max_usage, card[0].crd_type);
            return {status: 200, result: result};
        }catch(err){
            console.log(err);
            return {status: 500, result: err };
        }
    }

    //Create new card
    static async save(newCard) {
        try {
            let [cards, fields] = await pool.query("Select * from cards where crd_name=?", [newCard.name]);
            if (cards.length) // if the lenght is higher than 0
                return {
                    status: 400, result: [{
                        location: "body", param: "name",
                        msg: "That name already exists"
                    }]
                };
            let [result] =
                await pool.query(`Insert into cards (crd_name, crd_img_url, crd_lore, 
                crd_description, crd_level, crd_cost, crd_timeout, crd_max_usage, crd_type)
                values (?,?,?,?,?,?,?,?,?)`, [newCard.name, newCard.url, newCard.lore,
                newCard.description, newCard.level, newCard.cost, newCard.timeout,
                newCard.maxUsage, newCard.type]);
            return { status: 200, result: result };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }

    //Filter by Type
    static async filterByType(typeId) {
        try {
            let result = [];
            let [dbCards, fields] =
                await pool.query("Select * from cards where crd_type=?", [typeId]);
            for (let dbCard of dbCards) {
                result.push(new Card(card[0].crd_id,card[0].crd_name, 
                    card[0].crd_img_url, card[0].crd_lore, card[0].crd_description,
                    card[0].crd_level, card[0].crd_cost, card[0].crd_timeout,
                    card[0].crd_max_usage, card[0].crd_type));
            }
            return { status: 200, result: result };
        } catch (err) {
            console.log(err);
            return { status: 500, result: err };
        }
    }
}

module.exports = Card;