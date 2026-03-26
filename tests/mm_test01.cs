import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

public class LoginTest {

    public static void main(String[] args) {

        WebDriver driver = new ChromeDriver();

        driver.get("http://localhost:3000/login");

        driver.findElement(By.id("email")).sendKeys("student@test.com");
        driver.findElement(By.id("password")).sendKeys("123456");

        driver.findElement(By.id("loginBtn")).click();

        if(driver.getCurrentUrl().contains("dashboard")){
            System.out.println("Login Test Passed");
        } else {
            System.out.println("Login Test Failed");
        }

        driver.quit();
    }
}