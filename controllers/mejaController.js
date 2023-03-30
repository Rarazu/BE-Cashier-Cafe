const { request, response} = require("express")
const req = require("express/lib/request")

let modelMeja = require("../models/index").meja
let modelTransaksi = require("../models/index").transaksi

exports.getDataMeja = (request, response) => {
    modelMeja.findAll()
    .then(result => {
        return response.json(result)
    })
    .catch(error => {
        message: error.message
    })
}

exports.getMejaReady = async(request, response) => {
    let sequelize = require(`sequelize`)
    let Op = sequelize.Op
    
    let status = "belum_bayar"
    let allTable = await modelMeja.findAll()
    let usedTable =  await modelMeja.findAll({
        include : [
            {
                model : modelTransaksi,
                as : "transaksi",
                where : {
                    status:status
                },
            }
        ],
    })

    let allTableID = allTable.map(({id_meja}) => id_meja)
    let usedTableID = usedTable.map(({id_meja}) => id_meja)
    let availableMeja = []
    for (let i = 0; i < allTable.length; i++) {
        if(!usedTableID.includes(allTable[i].id_meja)) availableMeja.push((allTable[i]))
        
    }
    return response.json(availableMeja)
}

exports.addDataMeja = (request, response) => {
    let newMeja = {
        nomor_meja: request.body.nomor_meja
    }

    modelMeja.create(newMeja)
    .then(result => {
        return response.json({
            message: `Data meja berhasil ditambahkan`
        })
    })
    .catch(error => {
        message: error.message
    })
}

exports.editDataMeja = (request, response) => {
    let id = request.params.id_meja
    let dataMeja = {
        nomor_meja: request.body.nomor_meja
    }

    modelMeja.update(dataMeja, {where:{id_meja: id}})
    .then(result => {
        return response.json({
            message: `Data user berhasil diedit`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.deleteDataMeja = (request, response) => {
    let id = request.params.id_meja

    modelMeja.destroy({where: {id_meja: id}})
    modelMeja.update(dataMeja, {where:{id_meja: id}})
    .then(result => {
        return response.json({
            message: `Data user berhasil dihapus`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}