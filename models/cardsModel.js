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

    static async getById(id) {
        try{
            let result;
            let [card,fields] = await pool.query("Select * from cards where crd_id =?",[id]);
            if (card.length==0)
                  return {status:404, result: {msg: "No card found with that identifier"}};
            result = new Card(card.crd_id,card.crd_name, 
                card.crd_img_url, card.crd_lore, card.crd_description,
                card.crd_level, card.crd_cost, card.crd_timeout,
                card.crd_max_usage, card.crd_type);
            return {status: 200, result: result};
        }catch(err){
            console.log(err);
            return {status: 500, result: err };
        }
    }
}

module.exports = Card;