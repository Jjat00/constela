# Instrucciones de revisión de PRs

Este archivo define **qué** revisa Claude y **cómo** publica los hallazgos.
Lo lee el workflow `revision-de-prs.yml`; editarlo no requiere tocar el YAML.

## Cómo publicar los hallazgos

1. Obtén el diff con `gh pr diff <número>`. Ese diff es la unidad de revisión:
   solo comentas sobre líneas que el PR toca.
2. Lee los archivos completos que el diff modifica, más los que importen o sean
   importados por ellos. Un cambio se juzga en su contexto, no en aislamiento.
3. Publica **un solo review** con `gh api`, con los hallazgos como comentarios
   inline sobre las líneas concretas:

   ```bash
   gh api repos/<owner>/<repo>/pulls/<número>/reviews \
     --method POST \
     --field event=COMMENT \
     --field body='<resumen de una o dos líneas>' \
     --field 'comments[][path]=ruta/al/archivo.ts' \
     --field 'comments[][line]=42' \
     --field 'comments[][body]=<hallazgo>'
   ```

4. Cuando el arreglo quepa en pocas líneas, incluye un bloque `suggestion`
   dentro del comentario para que se aplique con un clic:

   ````
   Falta verificar que la nota pertenezca a quien consulta.

   ```suggestion
   .eq("author_id", user.id)
   ```
   ````

5. **Nunca** uses `event=REQUEST_CHANGES` ni `event=APPROVE`. El review informa;
   la decisión de mergear es humana.
6. Si no encuentras nada que reportar, publica un review con el cuerpo
   `Sin hallazgos.` y ningún comentario inline. No inventes hallazgos para
   justificar la corrida.
7. Marca cada hallazgo con su severidad al inicio del comentario:
   🔴 rompe algo en producción · 🟡 vale la pena arreglar, no bloquea.

## Qué revisar en Constela

Además de errores de lógica evidentes, presta atención a lo siguiente:

<!-- TODO(human): escribe aquí los criterios específicos de Constela -->

## Qué NO reportar

- Formato, estilo y nombres: de eso se encarga el linter.
- Archivos generados y lockfiles (`skills-lock.json`, `package-lock.json`).
- Preferencias de refactor sin defecto detrás ("esto quedaría más limpio si…").
- Sugerencias de tests para código que el PR no introdujo.
- Como máximo **5 hallazgos 🟡** por review. Si encuentras más, menciona el
  conteo en el resumen en vez de comentarlos todos.
