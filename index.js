const Express = require('express')
const YAML = require('js-yaml')
const FS = require('fs')
const Path = require('path')
const cors = require('cors')

const app = Express()
const levelsDir = __dirname

app.use(cors())
app.get(':path(*)', (req, res) => {
  const path = Path.join(levelsDir, req.params.path)

  FS.stat(path, (error, stat) => {
    if (error && error.code === 'ENOENT') {
      res.status(404)
      res.setHeader('Content-Type', 'text/plain')
      res.end(`Cannot find ${path}`)
    } else if (error) {
      res.status(500)
      res.setHeader('Content-Type', 'application/json')
      res.json({message: error.message, stack: error.stack})
      res.end()
    } else {
      if (stat.isDirectory()) {
        writeDirectory(path, res)
      } else {
        writeFile(path, res)
      }
    }
  })
})

function writeDirectory(path, res) {
  FS.readdir(path, (error, content) => {
    if (error) {
      res.status(500)
      res.setHeader('Content-Type', 'application/json')
      res.json({message: error.message, stack: error.stack})
      res.end()
    } else {
      res.setHeader('Content-Type', 'application/x-yaml')

      const entries = []
      for (const name of content) {
        const stat = FS.statSync(Path.join(path, name))
        if (stat.isDirectory() || name.endsWith('.yml')) {
          entries.push({name, isDirectory: stat.isDirectory()})
        }
      }
      res.end(YAML.dump(entries))
    }
  })
}

function writeFile(path, res) {
  FS.readFile(path, 'utf-8', (error, content) => {
    if (error) {
      res.status(500)
      res.json({message: error.message, stack: error.stack})
      res.end()
    } else {
      res.setHeader('Content-Type', 'application/x-yaml')
      res.end(content)
    }
  })
}

app.listen(3012)