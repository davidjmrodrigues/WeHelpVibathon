export function LogoWeHelp({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1000 562"
      className={className}
      role="img"
      aria-label="WeHelp — Apoios ao seu alcance"
    >
      <defs>
        <style>
          {`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap');
            .logo-fill { fill: #1b5c3e; }
            .subtitle {
              fill: #1b5c3e;
              font-family: 'Montserrat', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              font-size: 39px;
              font-weight: 600;
              letter-spacing: -0.3px;
            }`}
        </style>

        {/* Máscara para os recortes internos do W e das mãos dadas (compatível com fundo transparente) */}
        <mask id="w-cutout">
          <rect width="1000" height="562" fill="white" />
          {/* Espaço vazio esquerdo sob o braço */}
          <path d="M 239 229 C 253 236, 267 241, 280 243 L 259 303 L 237 238 C 236 233, 237 229, 239 229 Z" fill="black" />
          {/* Espaço vazio direito sob o braço */}
          <path d="M 351 229 C 337 236, 323 241, 310 243 L 331 303 L 353 238 C 354 233, 353 229, 351 229 Z" fill="black" />
          {/* Recorte curvo sob as mãos dadas */}
          <path d="M 277 242 Q 295 255 313 242" fill="none" stroke="black" strokeWidth="3.8" strokeLinecap="round" />
          {/* Detalhe do aperto de mão */}
          <path d="M 295 225 L 287 233 C 284 236, 286 240, 291 239 L 297 237 L 310 244" fill="none" stroke="black" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        </mask>

        {/* Molde da letra 'e' para reutilização */}
        <path id="letter-e" className="logo-fill" fillRule="evenodd" d="M 429 242 C 455 242, 472 261, 472 285 C 472 292, 467 296, 460 296 L 411 296 C 413 309, 422 316, 434 316 C 442 316, 448 313, 453 309 C 458 305, 465 306, 468 311 C 471 316, 469 322, 464 326 C 455 333, 444 336, 431 336 C 403 336, 386 316, 386 289 C 386 261, 404 242, 429 242 Z M 411 279 L 447 279 C 446 267, 439 260, 429 260 C 419 260, 412 267, 411 279 Z" />
      </defs>

      {/* Ícone 'W' com figuras humanas */}
      <g className="logo-fill" mask="url(#w-cutout)">
        {/* Cabeças */}
        <circle cx="238" cy="180" r="20" />
        <circle cx="352" cy="180" r="20" />
        {/* Corpos, braços e estrutura do W */}
        <path d="M 236 196 C 254 213, 274 224, 295 227 C 316 224, 336 213, 354 196 C 377 193, 398 209, 392 233 L 345 324 C 340 337, 322 337, 317 324 L 295 268 L 273 324 C 268 337, 250 337, 245 324 L 198 233 C 192 209, 213 193, 236 196 Z" />
      </g>

      {/* Primeiro 'e' */}
      <use href="#letter-e" />

      {/* Letra 'H' */}
      <g className="logo-fill">
        <rect x="483" y="213" width="26" height="122" rx="9" />
        <rect x="557" y="213" width="26" height="122" rx="9" />
        <rect x="496" y="264" width="74" height="23" />
      </g>

      {/* Segundo 'e' */}
      <use href="#letter-e" x="208" />

      {/* Letra 'l' */}
      <rect className="logo-fill" x="691" y="208" width="26" height="127" rx="9" />

      {/* Letra 'p' */}
      <path className="logo-fill" fillRule="evenodd" d="M 731 252 C 731 247, 735 243, 740 243 L 748 243 C 753 243, 756 246, 757 251 C 764 245, 773 242, 784 242 C 806 242, 821 261, 821 289 C 821 317, 806 336, 784 336 C 773 336, 764 332, 757 326 L 757 374 C 757 379, 753 383, 748 383 L 740 383 C 735 383, 731 379, 731 374 Z M 776 263 C 764 263, 756 273, 756 289 C 756 305, 764 315, 776 315 C 788 315, 796 305, 796 289 C 796 273, 788 263, 776 263 Z" />

      {/* Subtítulo */}
      <text x="480" y="379" className="subtitle" textAnchor="middle">Apoios ao seu alcance</text>
    </svg>
  );
}
