package com.bee.smartstadium.ui;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@SpringBootApplication ( scanBasePackages = "com.bee.smartstadium.ui")
@RestController
public class UiApplication {

    @RequestMapping("/resource")
    public Map<String,Object> home() {
        Map<String,Object> model = new HashMap<String,Object>();
        model.put("id", UUID.randomUUID().toString());
        model.put("content", "SMART Stadium Backend started");
        return model;
    }



    public static void main(String[] args) {
        SpringApplication.run(UiApplication.class, args);
    }



    @Configuration
    @Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
    protected static class SecurityConfiguration extends WebSecurityConfigurerAdapter {

        /**
         * @param http
         * @throws Exception
         */
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            http
                    .httpBasic()
                    .and()
                    .authorizeRequests()
                    .antMatchers("/index.html", "/home.html", "/login.html", "/").permitAll()
                    .antMatchers("/admin/**").hasRole("ADMIN")
                    .anyRequest().authenticated().and()
                    .addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class)
                    .csrf().csrfTokenRepository(csrfTokenRepository());;
        }


        @Autowired
        public void globalUserDetails(AuthenticationManagerBuilder auth) throws Exception {
            auth.inMemoryAuthentication()
                    .withUser("user").password("password").roles("USER")
                    .and()
                    .withUser("admin").password("admin").roles("USER", "ADMIN", "READER", "WRITER")
                    .and()
                    .withUser("audit").password("audit").roles("USER", "ADMIN", "READER");
        }
        /**
         * Echanges entre client et serveur :
         * La toute première requête d'un serveur n'a pas de cookie,
         * alors le serveur retourne l'action "Set-Cookie" et attribue "JSESSIONID" et "X-XSRF-TOKEN"
         *
         * CSRF Protection :
         *      Serveur ajoute un cookie XSRF-TOKEN au client
         *       Le client AngularJS requête le serveur avec X-XRSF-TOKEN en retour
         *       D'autres plateformes client utilisent X-CSRF-TOKEN
         */
        private CsrfTokenRepository csrfTokenRepository() {
            HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
            repository.setHeaderName("X-XSRF-TOKEN");
            return repository;
        }
    }



}