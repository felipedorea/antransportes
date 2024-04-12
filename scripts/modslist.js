

const modsList = [
    {
        id: 1,
        img: "../assets/imagens/imgmod",
        name: "Mod 1",
        categorie: "Caminhões",
        description: "Descrição do mod",
    },

    {
        id: 2,
        img: "../assets/imagens/imgmod",
        name: "Mod 2",
        categorie: "Caminhões",
        description: "Descrição do mod",
    },

    {
        id: 3,
        img: "../assets/imagens/imgmod",
        name: "Mod 3",
        categorie: "Caminhões",
        description: "Descrição do mod",
    },

    {
        id: 4,
        img: "../assets/imagens/imgmod",
        name: "Mod 4",
        categorie: "Caminhões",
        description: "Descrição do mod",
    },

    {
        id: 5,
        img: "../assets/imagens/imgmod",
        name: "Mod 5",
        categorie: "Caminhões",
        description: "Descrição do mod",
    },

    {
        id: 6,
        img: "../assets/imagens/imgmod",
        name: "Mod 6",
        categorie: "Caminhões",
        description: "Descrição do mod",
    }
]


let div = document.getElementById("Div")

const showHtml = modsList.map((mod, index) => {

    return `
    <h1>${mod.id}</h1>
    `
})

div.innerHTML = showHtml


