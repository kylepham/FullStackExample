const express = require('express')
const Sequelize = require('sequelize')
const db = require('./models')
const cors = require('cors')

const app = express() 
app.use(express.json())
app.use(cors())

// Posts
const postRouter = require('./routes/Posts')

// Comments
const commentRouter = require('./routes/Comments')

// Users
const userRouter = require('./routes/Users')

// Likes
const likeRouter = require('./routes/Likes')

app.use('/posts', postRouter)
app.use('/comments', commentRouter)
app.use('/auth', userRouter)
app.use('/like', likeRouter)


db.sequelize.sync().then(() => { // more: https://sequelize.org/master/manual/model-basics.html
    
    const PORT = 5000 || process.env.PORT
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

