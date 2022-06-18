const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.post('/', async (req, res) => {
	const { content } = req.body
	const banedWords = ['pakistan', 'orange']

	console.log(content);
	if (content.match(new RegExp(banedWords.join('|'), 'gi'))) {
		res.status(400).json({ status: 'rejected' })
	} else {
		res.status(201).json({ status: 'accepted' })
	}
})

/* ---------------- variables for port and connection string ---------------- */
const port = 3004

/* ------------------------------ server setup ------------------------------ */
app.listen(port, () => {
	console.log(`Moderation service running on port ${port}`)
})
