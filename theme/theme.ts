import { extendTheme } from '@chakra-ui/react'
import { CardComponent } from './additions/card/Card'
import { CardBodyComponent } from './additions/card/CardBody'
import { CardHeaderComponent } from './additions/card/CardHeader'
import { MainPanelComponent } from './additions/layout/MainPanel'
import { PanelContainerComponent } from './additions/layout/PanelContainer'
import { PanelContentComponent } from './additions/layout/PanelContent'
import { badgeStyles } from './components/badge'
import { buttonStyles } from './components/button'
import { drawerStyles } from './components/drawer'
import { Form } from './components/form'
import { linkStyles } from './components/link'
import { TextComponent } from './components/text'
import { breakpoints } from './foundations/breakpoints'
import { globalStyles } from './styles'

export default extendTheme(
  { breakpoints },
  TextComponent,
  globalStyles,
  buttonStyles,
  badgeStyles,
  linkStyles,
  drawerStyles,
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  MainPanelComponent,
  PanelContentComponent,
  PanelContainerComponent,
  Form
)
