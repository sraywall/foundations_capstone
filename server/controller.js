if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const {DATABASE_URL,HEROKU_POSTGRESQL_GOLD_URL,HEROKU_POSTGRESQL_PURPLE_URL} = process.env

const Sequelize = require('sequelize')

const sequelize = new Sequelize(DATABASE_URL, {
    dialect:"postgres",
    dialectOptions: {
        ssl:{
            rejectUnauthorized: false
        }
    }
})

const sequelize2 = new Sequelize(HEROKU_POSTGRESQL_GOLD_URL, {
    dialect:"postgres",
    dialectOptions: {
        ssl:{
            rejectUnauthorized: false
        }
    }
})
const sequelize3 = new Sequelize(HEROKU_POSTGRESQL_PURPLE_URL, {
    dialect:"postgres",
    dialectOptions: {
        ssl:{
            rejectUnauthorized: false
        }
    }
})

let recently_searched = []

module.exports = {
    getEntries : (req,res)=>{
        // for(let entry of res.body.rows){
        //     let word = entry.key
        //     let def = entry.value.Word

        //     console.log("word: ",word,"def:",def)
        // }
        let search_str = req.params.search
        search_str = search_str.replace("'","''").toLowerCase()
        console.log("searching string:",search_str)
        sequelize.query(`SELECT *
        FROM "tblEnglish2"
        WHERE LOWER("Word") LIKE '${search_str}%'
        ORDER BY LEVENSHTEIN("Word",'${search_str}');
        
        
        `)
        .then(dbRes=>res.status(200).send(dbRes[0]))
        .catch(err=>console.log(err))
        console.log(`Success!  ${req.params.search} was sent as a param!`)    
    },
    getNavEntries : (req,res) =>{
        let search_str = req.params.search
        search_str = search_str.replace("'","''").toLowerCase()
        // console.log("searching string:",search_str)
        let query_string = `SELECT *
        FROM "tblNavajo"
        WHERE "Word" LIKE '${search_str}%' OR unaccent(Lower("Word")) LIKE '${search_str}%'
        ORDER BY LEVENSHTEIN("Word",'${search_str}');
        `;
        sequelize2.query(query_string)
        .then(dbRes=>{
            sequelize3.query(query_string)//second Navajo Database
            .then(dbRes2=>res.status(200).send(dbRes[0].concat(dbRes2[0])))
            .catch(err=>console.log(err))            
        })
        .catch(err=>console.log(err))
        console.log(`Success!  ${req.params.search} was sent as a param!`)   
    },
    saveSearch : (req,res) => {
        const {Word} = req.body
        if(!recently_searched.includes(Word))
        recently_searched.unshift(Word)
        res.status(200).send(recently_searched)
    },
    getSearches: (req,res) =>{
        res.status(200).send(recently_searched)
    }
}