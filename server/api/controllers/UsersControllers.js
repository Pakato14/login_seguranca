const database = require('../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class UserControllers {
    static async pegaUser(req, res){        
        try{
            const cookie = req.cookies['jwt']
            const claims = jwt.verify(cookie, 'secret')
            if(!claims){
                return res.status(401).send({message: 'Usuário não autenticado!'})
            }
            const getUser = await database.User.findAll()
            return res.status(200).json(getUser)
        }
        catch (error){
            return res.status(500).json({message: 'Usuário não autenticado!'})
        }
    }

    static async cadastraUser(req, res) {        
        const novoUser = req.body;
        console.log('novoUser', novoUser)
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(novoUser.user_password, salt)
        novoUser.user_password = hashedPassword
        const hashedConfirmPassword = await bcrypt.hash(novoUser.user_confirm_password, salt)
        novoUser.user_confirm_password = hashedConfirmPassword
        //const newUser =  [novoUser.name, novoUser.email, novoUser.password ]
        const token = novoUser.user_phone.substring(7,11);
        try{
            const criarUser = await database.User.create({
                user_name: novoUser.user_name,
                user_email: novoUser.user_email,
                user_phone: novoUser.user_phone,
                user_token: token,
                user_password: novoUser.user_password,
                user_confirm_password: novoUser.user_confirm_password,                
            })
            const  result = await criarUser.save()
            const { password, ...data } = await result.toJSON()
            res.send(data)
            //return res.status(200).json(criarUser)
        }catch (error) {
            return res.status(500).json(error.message);
        }
    }

    static async verificaLogin(req, res) {
        const user = req.body;
        console.log('user', user)
        try{
            const  verificaUser = await database.User.findOne({
                where: { user_email: user.user_email }
            })
            if(!verificaUser){
                return res.status(404).send({ message: 'Usuário não encontrado!'})
            }
            if(!await bcrypt.compare(req.body.user_password, verificaUser.user_password )){
                return res.status(400).send({ message: 'Crendenciais inválidos!'})
            }

            const token = jwt.sign({_id:verificaUser.id}, "secret")

            res.cookie('jwt', token, {
                httpOnly:true,
                maxAge: 24*60*60*1000
            })
            res.send({ message: 'Usuário logado com sucesso!' })
            //res.send(verificaUserEmail)
            //return res.status(200).json(verificaUserEmail)
        }catch(error){
            res.send({ message: 'Problemas ao realizar login!' })
            //return res.status(500).json(error.message)
        }        
    }
    static async authenticatedUser(req, res){
        try{
            const cookie = req.cookies['jwt']

            const claims = jwt.verify(cookie, 'secret')

            if(!claims){
                return res.status(401).send({message: 'Usuário não autenticado!'})
            }

            const user = await database.User.findOne({
                where: {id: claims._id}
            })

            const { password, ...data } = await user.toJSON()
            res.send(data)

        }catch(error){
            return res.status(401).send({message: 'Usuário não autenticado!'})

        }
        
    }

    static async resetPassword(req, res) {
        const user = req.body;
        console.log('user', user)
        try{
            const  verificaUser = await database.User.findOne({
                where: { user_email: user.user_email }
            })
            if(!verificaUser){
                return res.status(404).send({ message: 'Usuário não encontrado!'})
            } 
            let newPassword = user.user_password
            const salt = await bcrypt.genSalt(10)
            const hashedNewPassword = await bcrypt.hash(newPassword, salt)
            newPassword = hashedNewPassword
            console.log('newPassword', newPassword)

            const novaSenha = await database.User.update({ user_password: newPassword }, { where: { user_email: user.user_email } });  

            //const  result = await novaSenha.save()
            //const { password, ...data } = await result.toJSON()
            res.send({message: 'Senha alterada com sucesso!'})
            
        }catch(error){
            //res.send(verificaUserEmail)
            return res.status(500).json(error.message)
        }        
    }

    static async logout(req, res){
        res.cookie('jwt', '', {maxAge: 0})
        res.send({ message: 'Logout Success!'})
    }
}


module.exports = UserControllers