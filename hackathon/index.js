const servicesButton = document.getElementById('services');
const dropdownMenu = document.querySelector('.dropdown-menu');


servicesButton.addEventListener('click', function() {
    if (dropdownMenu.style.display === 'flex') {
        dropdownMenu.style.display = 'none'; 
    } 
    else {
        dropdownMenu.style.display = 'flex'; 
    }
});


// Define the communities array
const communities = [
    {
      name: "Mentorship Programs",
      description: "A place for tech lovers to discuss and share ideas.",
    },
    {
      name: "English Literacy and IT Skills",
      description: "Join us to explore creativity through art and design.",
    },
    {
      name: "Consultation and Training Services",
      description: "For those who love playing or watching sports.",
    },
    {
      name: "Cultural Cafes",
      description: "Work together to protect and save the environment.",
    },
    {
      name: "Business and Innovation",
      description: "Dive into the world of books and share your insights.",
    },
    {
      name: "Professional Networks",
      description: "Dive into the world of books and share your insights.",
    },
    {
      name: "International Students",
      description: "Dive into the world of books and share your insights.",
    },
    {
      name: "Family and Health Issues",
      description: "Dive into the world of books and share your insights.",
    },
    {
      name: "Entrepreneurship and Innovation Hubs",
      description: "Dive into the world of books and share your insights.",
    },
  ];
  
  // Select the community container element
  const communityContainer = document.getElementById("communityContainer");
  
  // Function to load communities
  function loadCommunities() {
    // Clear existing content
    communityContainer.innerHTML = "";
  
    communities.forEach((community) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h2>${community.name}</h2>
        <p>${community.description}</p>
        <button onclick="joinCommunity('${community.name}')">Join Community</button>
      `;
      communityContainer.appendChild(card);
    });
  }
  
  // Function to join a community
  function joinCommunity(communityName) {
    alert(`You have joined the ${communityName} community!`);
  }
  
  // Add event listener to load communities when DOM is fully loaded
  document.addEventListener("DOMContentLoaded", loadCommunities);


  const legalServices = [
    {
      name: "Medical Services",
      description: "Access medical services effortlessly by utilizing the information provided",
    },
    {
      name: "Citizenship",
      description: "Access essential information and services related to cotizenship and immigration matters",
    },
    {
      name: "Social Security",
      description: "Find help stting up a social security Account.",
    },
    {
      name: "Driver`s License",
      description: "Find help with drivers license. This resource provides information on obtaining a drivers license and related services",
    },
    {
      name: "Legal Services",
      description: "Easily find immigration legal services. This resource simplifies the process of locating legal assisstance for your immgration-related requirements.",
    },
  ];
  
  const legalServicesContainer = document.getElementById("legalServicesContainer");
  
  function loadLegalServiceCards() {
    legalServices.forEach((service) => {
      const card = document.createElement("div");
      card.classList.add("legal-card");
      card.innerHTML = `
        <h2>${service.name}</h2>
        <p>${service.description}</p>
      `;
      legalServicesContainer.appendChild(card);
    });
  }
  
  // Function to join a legal service
function joinLegalService(serviceName) {
    alert(`You have joined the ${serviceName} legal service!`);
  }
  
  // Add event listener to load legal services when DOM is fully loaded
  document.addEventListener("DOMContentLoaded", loadLegalServiceCards);
  
  