---
title: Webdriver Agent Signing
---

The Appium device farm now allows you to manage devices readl IOS devices on non-Mac systems, including Raspberry Pi. To optimize its functionality, you need to re-sign the WebDriver agent with your provisioning profile and upload it to the device farm. The device farm will handle all the internal configuration. Below are the steps needed to sign the WebDriver agent.

## Prerequisite:

1.  Mac machine with xcode and xcode-command line tools installed
2.  Valid Apple account (With or without developer progrom subscription)
3.  iOS Resigner app to resing the wda ipa. You can download it from https://github.com/DanTheMan827/ios-app-signer/releases

## Download Webdriver Agent .ipa

The Appium device farm has already created a WDA IPA file that you can download and use for signing. You can get the IPA file from the [Appium Device Farm GitHub repository](https://github.com/AppiumTestDistribution/appium-device-farm/raw/main/WDA.ipa). Save the file to your Mac machine.

## Creating Provisioning profile

1. Lets Open Xcode and signin with the apple id.
   ![xcode](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step1-xcode-settings.png)

2. click on `+` icon to add a new account
   ![Xcode create account](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step2-add-account.png)

3. Select `Apple ID` from the options and click `Continue`
   ![Xcode sign in](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step3-add-account-apple-id.png)

4. Either login with your existing Apple id or click create Apple Id to create a new Apple account
   ![Xcode account](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step4-login-email.png)

5. Once logged in successfully, you should see you account added to the account list
   ![Xcode account list](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step5-after-login.png)

6. Now let's create the provisoning profile for resigning the wda. Open Xcode > File > New > Project
   ![Xcode create project](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step6-create-project.png)

7. Select any app type from the list. Lets go with `App` as it will be simple
   ![Xcode select app](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step7-selcect-app-type.png)

8. Enter a `Project Name` and a valid `Organization Identifier`. It can any value but make sure it is unique and Select the account the apple account you logged in from the `Team` dropdown. After enterning the details, click next and choose a folder to create the project.
   ![Xcode org id](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step8-enter-project-details.png)

9. Once the project is created, Click on the `Project Name` on the left pane and click on `Signing & Capabilities` Tab.
   You should see `Xcode Managed Profile` shown for Provisioning profile.
   ![xcode signing](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step9-post-project-creation.png)

10. You can also make sure if the provisioning profile is created under `~/Library/MobileDevice/Provisioning Profiles` directory. Once the provisioning profile is present we have now successfully created the provisioning profile which we can now use it for sigining the wda file.

11. Now to resign the ipa, open the `iOS Resigner app` that is previously downloaded. Select the wda.ipa file that is already downloaded in the input file. Select you Apple account from the `Signing Certificate` dropdown. Open `Provisioning Profile` dropdown and select the provisioning profile that you have created earlier.
    ![Ios resign](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step10-ios-resign-1.png)

12. Once all the details are entered, click start and select a folder to save the resgined ipa file. Make sure you save it with the name `wda-resign.ipa` and click save. This will create new file in the output directory.
    ![ios wda sign](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step11-ios-resign-save.png)

13. Once the webdriver agent is successfully resigned, it has to be uploaded to appium device from. To do that, open device farm with with the server url in browser and switch to `Apps` section and click on `Upload Apps` button.

![df app upload](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step12-df-uplaod-app.png)

14. Choose the resinged ipa with the name `wda-resign.ipa` and click upload. You should see the file upload success popup. That's it, you are now ready to use real ios deivce with device farm.
    ![df upload success](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/docs/assets/images/wda_signing/step13-df-uplaod-done.png)
