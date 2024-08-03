---
title: Webdriver Agent Signing
---

The Appium device farm now allows you to manage devices readl IOS devices on non-Mac systems, including Raspberry Pi. To optimize its functionality, you need to re-sign the WebDriver agent with your provisioning profile and upload it to the device farm. The device farm will handle all the internal configuration. Below are the steps needed to sign the WebDriver agent.

## Prerequisite:

1. A Mac machine with Xcode and Xcode command line tools installed
2. A valid Apple account (with or without a developer program subscription)
3. The iOS Resigner app for re-signing the WDA IPA, which you can download from [iOS Resigner GitHub](https://github.com/DanTheMan827/ios-app-signer/releases)

## Download Webdriver Agent .ipa

The Appium device farm has already built a WDA IPA file for you to download and use for signing. You can obtain the IPA file from the [Appium Device Farm GitHub repository](https://github.com/AppiumTestDistribution/appium-device-farm/raw/main/WDA.ipa). Save the file to your Mac machine.

## Creating Provisioning profile

1. Open Xcode and sign in with your Apple ID.
   ![xcode](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step1-xcode-settings.png)

2. click the `+` icon to add a new account
   ![Xcode create account](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step2-add-account.png)

3. Select `Apple ID` from the options and click `Continue`
   ![Xcode sign in](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step3-add-account-apple-id.png)

4. Log in with your existing Apple ID or click `Create Apple ID` to create a new Apple account.
   ![Xcode account](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step4-login-email.png)

5. Once logged in successfully, you should see your account added to the account list.
   ![Xcode account list](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step5-after-login.png)

6. Now, create the provisioning profile for re-signing the WDA. Open `Xcode > File > New > Project`.
   ![Xcode create project](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step6-create-project.png)

7. Select any app type from the list. Choosing `App` is recommended for simplicity.
   ![Xcode select app](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step7-selcect-app-type.png)

8. Enter a Project Name and a valid `Organization Identifier`. It can be any value, but ensure it is unique. Select the Apple account you logged in with from the Team dropdown. After entering the details, click `Next` and choose a folder to create the project.
   ![Xcode org id](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step8-enter-project-details.png)

9. Once the project is created, click on the `Project Name` in the left pane and select the `Signing & Capabilities` tab. You should see `Xcode Managed Profile` listed under Provisioning Profile.
   ![xcode signing](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step9-post-project-creation.png)

10. You can also check if the provisioning profile is created in the `~/Library/MobileDevice/Provisioning Profiles directory`. Once the provisioning profile is present, you have successfully created it and can now use it to sign the WDA file.

11. To re-sign the IPA, open the `iOS Resigner app` that you previously downloaded. Select the WDA IPA file that you downloaded as the input file. Choose your Apple account from the `Signing Certificate` dropdown. In the `Provisioning Profile` dropdown, select the provisioning profile you created earlier.
    ![Ios resign](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step10-ios-resign-1.png)

12. After entering all the details, click "Start" and select a folder to save the resigned IPA file. Ensure you save it with the name `wda-resign.ipa` and click "Save." This will create a new file in the output directory.
    ![ios wda sign](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step11-ios-resign-save.png)

13. Once the WebDriver agent is successfully re-signed, it needs to be uploaded to the Appium device farm. Open the device farm using the server URL in your browser, switch to the `Apps` section, and click the `Upload Apps` button.

![df app upload](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step12-df-uplaod-app.png)

14. Choose the resigned IPA named `wda-resign.ipa` and click "Upload." You should see a success popup indicating the file upload was successful. That's it! You are now ready to use real iOS devices with the device farm.
    ![df upload success](https://raw.githubusercontent.com/AppiumTestDistribution/appium-device-farm/main/documentation/docs/assets/images/wda_signing/step13-df-uplaod-done.png)
