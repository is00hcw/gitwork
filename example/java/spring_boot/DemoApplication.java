package demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.*;
import org.springframework.web.bind.annotation.*;
 
//  spring init -d=web
//  spring run
 
@RestController
@EnableAutoConfiguration
@SpringBootApplication
public class DemoApplication {
	
	@RequestMapping("/")
    String home() {
        return "Hello World!";
    }
	
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
