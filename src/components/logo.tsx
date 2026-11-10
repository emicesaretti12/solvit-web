import { useId } from "react";

/*
  Isotipo de SEN: la S en tres cintas plegadas (dos caras al frente y el pliegue en sombra),
  redibujado en vectores a partir del isotipo original. Degradé azul eléctrico a cian, solo en
  el logo. Reemplazar por el SVG original cuando esté disponible.
*/
export function LogoMark({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 515 787" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-face`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#0052ff" />
          <stop offset="0.55" stopColor="#0a8bff" />
          <stop offset="1" stopColor="#1fdcff" />
        </linearGradient>
        <linearGradient id={`${id}-fold`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0" stopColor="#002a9e" />
          <stop offset="1" stopColor="#0064ff" />
        </linearGradient>
      </defs>
      <polygon points="0,399 280,273 515,391 232,515" fill={`url(#${id}-fold)`} />
      <polygon points="0,217 468,0 468,189 0,399" fill={`url(#${id}-face)`} />
      <polygon points="52,594 515,391 515,584 52,787" fill={`url(#${id}-face)`} />
    </svg>
  );
}

/*
  Wordmark SEN: contornos de Krona One (la tipografía del brand board) con el corte azul en
  la punta de la N, que reemplaza el remate del palo derecho (no se superpone: así también
  funciona con transparencias). En vectores para que se vea igual antes de que cargue la fuente.
*/
const LETTERS =
  "M126-208L295-465Q380-417 468-379Q555-340 649-314Q743-287 847-273Q950-259 1067-259L1067-259Q1208-259 1307-278Q1406-296 1469-329Q1531-361 1560-406Q1588-451 1588-504L1588-504Q1588-589 1517-639Q1446-688 1298-688L1298-688Q1233-688 1161-680Q1089-671 1016-661Q942-651 871-643Q799-634 736-634L736-634Q631-634 535-661Q438-688 364-742Q289-796 245-877Q201-958 201-1066L201-1066Q201-1130 219-1193Q236-1256 275-1314Q313-1371 374-1421Q435-1470 522-1506Q608-1542 722-1563Q835-1583 980-1583L980-1583Q1085-1583 1191-1572Q1297-1560 1398-1539Q1498-1518 1591-1489Q1684-1459 1764-1423L1764-1423L1625-1167Q1559-1196 1483-1221Q1407-1245 1324-1263Q1241-1281 1153-1292Q1064-1302 972-1302L972-1302Q841-1302 757-1283Q672-1264 622-1235Q572-1205 553-1169Q533-1132 533-1096L533-1096Q533-1026 596-982Q659-937 788-937L788-937Q840-937 908-945Q975-952 1050-961Q1124-970 1202-978Q1279-985 1352-985L1352-985Q1490-985 1597-954Q1703-923 1775-866Q1847-808 1884-727Q1921-645 1921-544L1921-544Q1921-409 1859-304Q1796-198 1681-126Q1565-53 1402-16Q1239 22 1039 22L1039 22Q907 22 781 6Q655-11 540-42Q424-72 320-115Q215-157 126-208L126-208ZM2270 0L2270-1563L3601-1563L3601-1285L2587-1285L2587-973L3485-973L3485-712L2587-712L2587-277L3622-277L3622 0L2270 0ZM3972 0L3972-1563L4289-1563L5263-1053L5263-1155L5580-1155L5580 0L5263 0L5263-717L4289-1224L4289 0L3972 0Z";
const ACCENT = "5263,-1563 5740,-1563 5580,-1155 5263,-1155";

export function Wordmark({
  className = "",
  accentClassName = "",
}: {
  className?: string;
  accentClassName?: string;
}) {
  return (
    <svg viewBox="126 -1583 5614 1605" className={className} aria-hidden="true" focusable="false">
      <path d={LETTERS} fill="currentColor" />
      <polygon points={ACCENT} fill="var(--blue-500)" className={accentClassName} />
    </svg>
  );
}

export const BRAND_NAME = "SEN Software";
export const BRAND_TAGLINE = "Ingeniería y desarrollo de software";
export const BRAND_FULL = `SEN Software · ${BRAND_TAGLINE}`;

/* Ícono de app del brand board: el isotipo sobre un cuadrado navy con borde azul (igual en los
   dos temas, como un ícono instalado) */
export function AppIcon({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid aspect-square shrink-0 place-items-center rounded-[28%] border border-blue-500/50 bg-[linear-gradient(160deg,#10264d,#061330)] ${className}`}
    >
      <LogoMark className="h-[50%] w-auto" />
    </span>
  );
}

export function Logo({
  className = "",
  withTagline = false,
}: {
  className?: string;
  withTagline?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-7 w-auto shrink-0" />
      <span className="flex flex-col">
        <Wordmark className="h-[0.95rem] w-auto self-start text-ink" />
        {/* Bajada del brand board: mayúsculas con tracking amplio, solo en el logo */}
        {withTagline && (
          <span className="mt-2 text-[11px] uppercase tracking-[0.2em] text-ink-muted">{BRAND_TAGLINE}</span>
        )}
      </span>
      <span className="sr-only">{BRAND_NAME}</span>
    </span>
  );
}
