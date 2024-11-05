let artStyles = []
const styleContainer = document.getElementById('style-container')
const form = document.getElementById('userForm')

// Store form data
let formData = {
  theme: '',
  styles: []
}

async function fetchStyles() {
  try {
    const response = await fetch("http://localhost:8000/api/styles")
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const styles = await response.json()
    artStyles = styles

    // Render styles
    renderStyles(artStyles, styleContainer)

  } catch (error) {
    console.error('Error fetching styles:', error)
  }
}

function renderStyles(styles, target) {
  target.innerHTML = '' // Clear existing content

  if (!Array.isArray(styles)) {
    console.error('Styles is not an array:', styles)
    return
  }

  const sortedStyles = [...styles].sort()

  sortedStyles.forEach((style) => {
    const label = document.createElement('label')
    label.style.margin = '2px'
    label.className = 'style-label'

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.value = style
    checkbox.id = `style-${style}`
    checkbox.name = "style"

    const text = document.createElement('span')
    text.className = 'style-text'
    text.textContent = style.replace('-', ' ')

    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        formData.styles = [...(formData.styles || [])]
        formData.styles.push(style)
      } else {
        formData.styles = formData.styles.filter(s => s !== style)
      }
      console.log('Selected styles:', formData.styles)
    })

    label.appendChild(checkbox)
    label.appendChild(text)
    target.appendChild(label)
  })
}

function renderInspirations(inspirations) {
  const inspirationContainer = document.getElementById('inspiration-container')
  inspirationContainer.innerHTML = '' // Clear existing content

  inspirations.forEach((inspiration, i) => {
    const inspirationElement = document.createElement('div')
    inspirationElement.className = 'inspiration-element'

    // Inspiration number
    const numberDiv = document.createElement('div')
    numberDiv.className = 'inspiration-number'
    numberDiv.textContent = (i + 1).toString().padStart(2, '0')

    // Inspiration info container
    const infoDiv = document.createElement('div')
    infoDiv.className = 'inspiration-info'

    // Inspiration name with link
    const nameDiv = document.createElement('p')
    nameDiv.className = 'inspiration-name'
    const nameLink = document.createElement('a')
    nameLink.href = inspiration.url
    nameLink.className = 'inspiration-link'
    nameLink.target = '_blank'
    nameLink.textContent = inspiration.name
    nameDiv.appendChild(nameLink)

    // Styles
    const stylesDiv = document.createElement('p')
    stylesDiv.className = 'inspiration-styles'
    const styleLinks = inspiration.styles.map(style => {
      return `<a href="${style.url}" class="inspiration-link" target="_blank">${style.name}</a>`
    })
    stylesDiv.innerHTML = styleLinks.join(', ')

    // Assemble all elements
    infoDiv.appendChild(nameDiv)
    infoDiv.appendChild(stylesDiv)
    inspirationElement.appendChild(numberDiv)
    inspirationElement.appendChild(infoDiv)

    inspirationContainer.appendChild(inspirationElement)
  })
}

fetchStyles()

// Update formData when input changes
document.getElementById('name').addEventListener('input', function (e) {
  formData.theme = e.target.value
})

// Handle form submission
form.addEventListener('submit', async function (e) {
  e.preventDefault()
  try {
    const button = form.querySelector('button')
    const originalText = button.textContent
    button.textContent = 'Generating...'
    button.disabled = true

    const inspirations = await generateInspirations(formData)
    renderInspirations(inspirations.inspirations)
    button.textContent = originalText
    button.disabled = false

    form.reset()
    formData = { theme: '', styles: [] }

  } catch (error) {
    console.error('Error:', error)
    document.getElementById('nameError').textContent = 'An error occurred. Please try again.'
  }
})

// Example async function - replace with your actual implementation
async function generateInspirations(data) {
  console.log('Generating inspirations with data:', data)

  const response = await fetch("http://localhost:8000/api/generateInspiration", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const inspirations = await response.json()
  const processedInspirations = inspirations['data'].map((inspiration) => {
    return {
      styles: inspiration['styles'].map((style) => { return { name: style['name'], url: style['url'] } }),
      name: inspiration['name'],
      url: inspiration['url']
    }
  })
  return {
    success: true,
    inspirations: processedInspirations
  }
}
