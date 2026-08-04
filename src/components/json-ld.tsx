/**
 * Un bloque de datos estructurados.
 *
 * El `<` escapado a `<` no es paranoia decorativa: los datos que entran
 * aquí incluyen nombres y textos que en algún momento saldrán de la base
 * (tags, eventos), y un `</script>` dentro de una cadena cerraría la etiqueta
 * y convertiría el resto del JSON en HTML ejecutable.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
