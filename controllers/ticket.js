const { PrismaClient } = require('@prisma/client')

const { TicketError, RequestError } = require('../error/customError')

const prisma = new PrismaClient()

exports.getAllTickets=async (req, res, next) => {
    try{
      const ticket = await prisma.ticket.findMany({
        include:{user:true},
        
      })

     
      res.json({ticket})
    } catch (error) {
      next(error)
    }
};


exports.getTicket = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

    // Vérification si le champ id est présent et cohérent
    if (!id) {
        throw new RequestError('Missing parameter')
    }
      
    const ticket = await prisma.ticket.findUnique({
        where: {
          id: Number(id),      
        },
        include: {user:true},
    })

    // Test si résultat
    if (ticket === null) {
      throw new TicketError('Ce ticket n\'existe pas',0)
  }
      res.json(ticket)
    } catch (error) {
      next(error)
    }  
  };



exports.addTicket = async (req, res, next) => {
    try {
      const ticket = await prisma.ticket.create({
        data: req.body,
      })
      res.json(ticket)
      
    } catch (error) {
      next(error)
    }  

};


exports.deleteTicket= async (req, res, next) => {
    try {
  
      const {id}= req.params
      const ticket = await prisma.ticket.delete({
        where:{
          id: Number(id)
        }
      })
      res.json(ticket)
  
    } catch (error) {
      next(error)
    }
  };
  
exports.updateTicket= async (req, res, next) => {
    try {
     const id = parseInt(req.params.id)

    //tester le id
    if(!id) {
        return res.status(400).json({msg:"missing parameters"});
    }

    const ticketId = await prisma.ticket.findMany({
        where:{
          id: id
        }
      })

      if (ticketId.length === 0) {
        return res.status(400).json({msg:"id n'existe pas"});
      }

    

      const ticket = await prisma.ticket.update({
        data: req.body,
        where:{
          id: Number(id)
        }
      })
      res.json(ticket)
      
    } catch (error) {
      next(error)
    } 
  };