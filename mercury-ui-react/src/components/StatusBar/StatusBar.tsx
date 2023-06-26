import React, { useEffect, useState } from "react"
import {
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core"
import { init, os } from "@neutralinojs/lib"
import mercury from "../../mercury"
import { useDispatch } from "react-redux"
import { setCommand } from "../../redux/slices/appSlice"

export const StatusBar = () => {
  const [gamePath, setGamePath] = useState("")
  const [version, setVersion] = useState("")
  const [config, setConfig] = useState({} as any)
  const dispatch = useDispatch()

  useEffect(() => {
    const getConfig = async () => {
      try {
        const config = await mercury.config()
        if (config) {
          setConfig(config)
        }
        const v = await mercury.version()
        setVersion(v || "unknown")
      } catch (error) {
        console.error(error)
      }
    }
    getConfig()
  }, [])

  useEffect(() => {
    const getPath = async () => {
      const pathFromEnv = await os.getEnv("HALO_CE_PATH")
      if (pathFromEnv) {
        setGamePath(pathFromEnv)
        return
      }
      if (config?.game?.path) {
        setGamePath(config.game.path)
      }
    }
    getPath()
  }, [config])

  return (
    <Navbar
      style={{
        position: "sticky",
        bottom: 0,
        marginTop: "auto"
      }}
    >
      <NavbarGroup align="left">
        <NavbarHeading>
          <b>Game Path:</b> {gamePath ? gamePath : "Not configured"}
        </NavbarHeading>
      </NavbarGroup>
      <NavbarGroup align="right">
        <Button
          icon="cog"
          text="Game path"
          onClick={async () => {
            const path = await os.showFolderDialog("Select game path")
            if (path) {
              //dispatch(setCommand(`mercury config game.path ${path}`))
              const result = await mercury.config("game.path", path)
              if (result) {
                // Refresh application
                window.location.reload()
              }
            }
          }}
        />
        <NavbarDivider />
        <small>v{version || process.env.REACT_APP_VERSION}</small>
      </NavbarGroup>
    </Navbar>
  )
}

export default StatusBar
