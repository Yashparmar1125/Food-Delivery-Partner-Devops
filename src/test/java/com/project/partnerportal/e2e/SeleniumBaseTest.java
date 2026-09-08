package com.project.partnerportal.e2e;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import java.time.Duration;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public abstract class SeleniumBaseTest {

    protected static final Logger log = LoggerFactory.getLogger(SeleniumBaseTest.class);

    @LocalServerPort
    protected int port;

    protected WebDriver driver;
    protected String baseUrl;
    protected static boolean chromeAvailable = true;

    @BeforeAll
    static void setupDriver() {
        try {
            WebDriverManager.chromedriver().setup();
        } catch (Exception e) {
            log.warn("WebDriverManager could not resolve ChromeDriver automatically: {}", e.getMessage());
            chromeAvailable = false;
        }
    }

    @BeforeEach
    void initBrowser() {
        baseUrl = "http://localhost:" + port;

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--remote-allow-origins=*");

        // Explicit binary fallbacks for Linux CI / Docker containers
        java.io.File chromium = new java.io.File("/usr/bin/chromium");
        java.io.File chromiumBrowser = new java.io.File("/usr/bin/chromium-browser");
        java.io.File googleChrome = new java.io.File("/usr/bin/google-chrome");
        if (chromium.exists()) {
            options.setBinary(chromium);
        } else if (chromiumBrowser.exists()) {
            options.setBinary(chromiumBrowser);
        } else if (googleChrome.exists()) {
            options.setBinary(googleChrome);
        }

        try {
            driver = new ChromeDriver(options);
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(15));
        } catch (Exception e) {
            log.warn("Headless ChromeDriver initialization encountered issue: {}", e.getMessage());
            driver = null;
        }
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            try {
                driver.quit();
            } catch (Exception ignored) {
            }
        }
    }

    protected boolean isDriverActive() {
        return driver != null;
    }
}
