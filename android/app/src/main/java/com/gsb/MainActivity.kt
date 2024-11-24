package com.gsbfit

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "GSB"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [ReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flag [fabricEnabled].
   * We also use [RNGestureHandlerEnabledRootView] as the root view.
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate {
    return object : ReactActivityDelegate(this, mainComponentName) {
      override fun createRootView(): RNGestureHandlerEnabledRootView {
        return RNGestureHandlerEnabledRootView(this@MainActivity)
      }
    }
  }
}
