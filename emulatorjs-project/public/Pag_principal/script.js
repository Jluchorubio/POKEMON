  // Mobile menu functionality
  const mobileMenuOpen = document.getElementById('mobile-menu-open');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');

  mobileMenuOpen.addEventListener('click', () => {
    mobileMenu.classList.remove('hidden');
  });

  mobileMenuClose.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });

  mobileMenuBackdrop.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
  });

  // Close mobile menu when clicking on a link
  const mobileMenuLinks = mobileMenu.querySelectorAll('a');
  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  //POKEMON DESTACADOS
// Pokemon data (Primera Generación - primeros 10 para el ejemplo)
    const pokemonData = [
      { id: 1, name: "Bulbasaur", type: "Planta/Veneno", height: "0.7 m", weight: "6.9 kg", description: "Hay una semilla de planta en su espalda desde que nace. La semilla crece lentamente." },
      { id: 4, name: "Charmander", type: "Fuego", height: "0.6 m", weight: "8.5 kg", description: "Prefiere las cosas calientes. Dicen que cuando llueve, sale vapor de la punta de su cola." },
      { id: 7, name: "Squirtle", type: "Agua", height: "0.5 m", weight: "9.0 kg", description: "Cuando retrae su largo cuello en su caparazón, dispara agua con una fuerza increíble." },
      { id: 25, name: "Pikachu", type: "Eléctrico", height: "0.4 m", weight: "6.0 kg", description: "Cuando varios de estos Pokémon se juntan, su electricidad puede causar tormentas eléctricas." },
      { id: 39, name: "Jigglypuff", type: "Normal/Hada", height: "0.5 m", weight: "5.5 kg", description: "Cuando sus enormes ojos se iluminan, canta una melodía misteriosamente tranquilizadora." },
      { id: 52, name: "Meowth", type: "Normal", height: "0.4 m", weight: "4.2 kg", description: "Adora las monedas redondas y brillantes. Vaga por las calles en busca de cambio perdido." },
      { id: 54, name: "Psyduck", type: "Agua", height: "0.8 m", weight: "19.6 kg", description: "Sufre dolores de cabeza constantes. Si el dolor se intensifica, usa misteriosos poderes." },
      { id: 94, name: "Gengar", type: "Fantasma/Veneno", height: "1.5 m", weight: "40.5 kg", description: "Aparece en lugares oscuros. Para asustar, se comporta como si fuera tu sombra." },
      { id: 133, name: "Eevee", type: "Normal", height: "0.3 m", weight: "6.5 kg", description: "Gracias a su irregular composición genética, puede evolucionar de muchas formas diferentes." },
      { id: 150, name: "Mewtwo", type: "Psíquico", height: "2.0 m", weight: "122.0 kg", description: "Fue creado por un científico tras años de experimentos de ingeniería genética." }
    ];

    let currentIndex = 0;

    function updateDisplay() {
      const pokemon = pokemonData[currentIndex];
      
      document.getElementById('pokemon-image').src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
      document.getElementById('pokemon-number').textContent = `#${String(pokemon.id).padStart(3, '0')}`;
      document.getElementById('pokemon-name').textContent = pokemon.name;
      document.getElementById('pokemon-type').textContent = pokemon.type;
      document.getElementById('pokemon-height').textContent = pokemon.height;
      document.getElementById('pokemon-weight').textContent = pokemon.weight;
      document.getElementById('pokemon-description').textContent = pokemon.description;
      
      // Animación de entrada
      const img = document.getElementById('pokemon-image');
      img.style.opacity = '0';
      img.style.transform = 'scale(0.8)';
      setTimeout(() => {
        img.style.transition = 'all 0.3s ease';
        img.style.opacity = '1';
        img.style.transform = 'scale(1)';
      }, 50);
    }

    // Event listeners
    document.getElementById('prev-btn').addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + pokemonData.length) % pokemonData.length;
      updateDisplay();
    });

    document.getElementById('next-btn').addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % pokemonData.length;
      updateDisplay();
    });

    document.getElementById('random-btn').addEventListener('click', () => {
      currentIndex = Math.floor(Math.random() * pokemonData.length);
      updateDisplay();
    });

    // Controles de teclado
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        document.getElementById('prev-btn').click();
      } else if (e.key === 'ArrowRight') {
        document.getElementById('next-btn').click();
      } else if (e.key === ' ') {
        e.preventDefault();
        document.getElementById('random-btn').click();
      }
    });

    // Inicializar
    updateDisplay();