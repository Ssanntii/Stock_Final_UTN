## Preguntas

```jsx
import { sequelize } from './config/db.mjs'
import './config/db.mjs'
//??
```
- El hash se puede poner char(60).
- El isActivate en boolean lo convierte en tinyint en mysql. Tiene default false pero no lo interpreta bien y devuelve null.
- Tengo un error en el login en la linea 36 donde se hace el fetch, puede ser por la ruta.
- Ahora la duda, según la IA y lo q mas o menos me explico agustin, el la clave secreta que vos tenes para firmar y verificar los tokens, como yo no tenía eso supongo que no me generaba los tokens xq los estaba firmando con literalmente nada. Esa secret, la tnego q sacar de algun lado o la asigno yo en las variables de entorno y le pongo cualquier cosa?
