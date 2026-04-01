import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { setCurrentUser } from '../reducers/currentUserReducer'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'

export default function NavBar() {
  const currentUser = useSelector((state) => state.currentUser)
  const dispatch = useDispatch()

  function handleUserLogout() {
    localStorage.removeItem('loggedBlogAppUser')
    dispatch(setCurrentUser(null))
  }
  return (
    <div className="flex items-center justify-between w-ful py-4 mb-20">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <NavLink to="/">blogs</NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <NavLink to="/users">users</NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {currentUser && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            {currentUser.name}
          </span>
          <Button variant="outline" size="sm" onClick={handleUserLogout}>
            Logout
          </Button>
        </div>
      )}
    </div>
  )
}
