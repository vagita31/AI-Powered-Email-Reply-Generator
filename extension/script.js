console.log("well-come to Gmail...")

const getEmailContent = () => {
  const selectors = [
    '.a3s .aiL',
    '.h7 ',
    '[role=presentation]'
  ]
  
  for(let selector of selectors) {
    const emailContent = document.querySelector(selector);
    if(emailContent) {
    console.log('successfuly get the email content')
        return emailContent.innerText.trim();
    }
    
  }
    return '';
  
}

const getToolbar = ()=> {
    const selectors = [
        '.btC',
        '.aDh',
        '.gU .Up',
        '[role="toolbar"]'
    ]

    for(let selector of selectors) {
        const toolbar = document.querySelector(selector)
        
        if(toolbar) return toolbar;
     return null;
    }
}

const createAIButton = () => {
    const button = document.createElement('div')
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3'
    button.innerHTML = 'try AI'
    button.style.marginRight = '8px'
    button.setAttribute('role','button')
    button.setAttribute('data-tooltip', 'Generate AI Reply')
    return button;
}

const injectButton = () => {
    const existingButton = document.querySelector('.aiB');

    console.log(existingButton)
    if(existingButton){
        console.log("removing exiting button")
        existingButton.remove();
    }

    const toolbar = getToolbar()
    if(!toolbar) {
        console.log('faild to find toolbar')
        return;
    }

    console.log('succesfully finded toolbar') 
    const  aiButton = createAIButton()
    aiButton.classList.add('aiB')

    aiButton.addEventListener('click' , async () => {
        try {
            aiButton.innerHTML = 'Generating...'
            aiButton.disabled = true
            const emailContent = getEmailContent()
            console.log(emailContent)
            const response = await fetch('http://localhost:8080/api/email/generate' , {
                method: 'POST',
                headers:{ 
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: 'professional'
                })
            })

            if(!response.ok) console.log('error fetching response')
            
            const generatedText = await response.text()
            // const generatedText = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
            const textBox = document.querySelector('[role="textbox"][g_editable="true"]')

            if(textBox) {
                console.log(' writing renerated reply...')
                textBox.focus()
                document.execCommand('insertText', false, generatedText)
            }
        } catch (e) {
            console.log('error fetching renerated reply');
            return;
        } finally {
            aiButton.innerHTML = 'try AI'
            aiButton.disabled = false;
        }
    })

    console.log('adding button to toolbar')
    toolbar.insertBefore(aiButton, toolbar.firstChild)
    console.log('button added successfully')
}

const observer = new MutationObserver((mutations) => {
    //mutations is an array of changes
    for( let mutation of mutations) {

        const addedNode = Array.from(mutation.addedNodes);
        //addedNode is an array of changed objects or HTML element

        const hasComposeElement = addedNode.some( (node) => //some() describes whether any element in array meets condition 
            
            node.nodeType === Node.ELEMENT_NODE //if node is an element not an text or something
            &&  (node.matches('.btC , .aDg , .aDh, [role="dialog"]') || node.querySelector('.btC , .aDg , .aDh, [role="dialog"]'))
            //and node element or its child has mentioned class list
        );


        if(hasComposeElement) {
            //its time to inject owr code
            console.log("compose element founded...");
            setTimeout(injectButton, 500);
        }

    }
})


observer.observe(document.body, {
    childList: true,
    subtree: true
})