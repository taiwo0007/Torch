package com.troch.torchApplication.config;

import com.troch.torchApplication.filters.JwtFilter;
import com.troch.torchApplication.services.UserService;
import com.troch.torchApplication.services.UserServiceImpl;
import org.springframework.web.filter.CorsFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
//
//    @Autowired
//    private UserService userService;
//
//    @Bean
//    public BCryptPasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder();
//    }
//
//    @Bean
//    public DaoAuthenticationProvider authenticationProvider() {
//        DaoAuthenticationProvider auth = new DaoAuthenticationProvider();
//        auth.setUserDetailsService(userService);
//        auth.setPasswordEncoder(passwordEncoder());
//        return auth;
//    }
//
//    @Override
//    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
//
//        auth.authenticationProvider(authenticationProvider());
//    }
//
//
//
//
//
//    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http.cors().and().csrf().disable();
//
//        http.authorizeRequests().antMatchers(
//                        "/registration/**",
//                        "/user**",
//                        "/**",
//                        "/js/**",
//                        "/css/**",
//                        "**",
//                        "/*.js", "/**.js",
//                        "js.stripe.com/v3/",
//                        "/api/**",
//                        "/img/**").permitAll()
//                .anyRequest().authenticated()
//                .and()
//                .formLogin()
//                .loginPage("/user/signin")
//                .permitAll()
//                .and()
//                .logout()
//                .invalidateHttpSession(true)
//                .clearAuthentication(true)
//                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
//                .logoutSuccessUrl("/user/signin?logout")
//                .permitAll();
//    }
//
//    @Bean
//    CorsConfigurationSource corsConfigurationSource() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(Arrays.asList("1.1.1.1","0.0.0.0", "*", "127.0.0.1:8080"));
//
//        configuration.setAllowedMethods(Arrays.asList("*"));
//        configuration.setAllowedHeaders(Arrays.asList("*"));
//        configuration.setAllowCredentials(true);
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return source;
//    }
//
//    @Bean(name = BeanIds.AUTHENTICATION_MANAGER)
//    @Override
//    public AuthenticationManager authenticationManager() throws Exception{
//
//        return super.authenticationManagerBean();
//    }
//
//}

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserServiceImpl userDetailsService;

    @Autowired
    private JwtFilter jwtFilter;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService);
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList("https://torch-front-end-wfurmbodqa-nw.a.run.app/",
                "https://torch-front-end-wfurmbodqa-nw.a.run.app", "http://torch-wfurmbodqa-uc.a.run.app",
                "https://torch-wfurmbodqa-uc.a.run.app/", "http://localhost:4200", "1.1.1.1","https://0.0.0.0",
                "http://0.0.0.0",  "127.0.0.1", "http://localhost:8080", "https://stripe.com", "https://stripe.com/"));

        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Bean(name = BeanIds.AUTHENTICATION_MANAGER)
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.cors().and().csrf().disable();

        http.authorizeRequests()
                .antMatchers("/this/**")
                .permitAll()
                .antMatchers("/api/auth/**")
                .permitAll()
                .antMatchers("/webhook/**")
                .permitAll()
                .antMatchers("/api/escooter/findescooters/**")
                .permitAll()
                .antMatchers("/api/escooter/find-escooter-ads/**")
                .permitAll()
                .antMatchers("/api/escooter/escooter-detail/**")
                .permitAll()
                .antMatchers("/api/escooter/escooter-reviews/**")
                .permitAll()
                .antMatchers("/api/host/make-user-host")
                .authenticated()
                .antMatchers("/api/host/host-details/*")
                .permitAll()
                .antMatchers("/api/host/insurance-list/**")
                .permitAll()
                .antMatchers("/api/host/makes")
                .permitAll()
                .antMatchers("/api/host/top")
                .permitAll()
                .antMatchers("/api/host/host-data")
                .authenticated()
                .antMatchers("/api/host/scooter-list/**")
                .permitAll()
                .antMatchers("/api/host/add-escooter")
                .authenticated()
                .antMatchers("/api/user/**")
                .permitAll()
                .antMatchers("**/create-checkout-session")
                .permitAll()
                .antMatchers("/v2/api-docs",
                        "/configuration/ui",
                        "/swagger-resources/**",
                        "/configuration/security",
                        "/swagger-ui/**",
                        "/swagger/**",
                        "/webjars/**",
                        "/api/escooter/create-review",
                        "/api/trips/cancel-trip/**",
                        "/swagger-ui.html"
                       )
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .exceptionHandling()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);;
    }


//    @Override
//    public void configure(HttpSecurity httpSecurity) throws Exception {
//        httpSecurity.cors().and()
//                .csrf().disable()
//                .authorizeHttpRequests(authorize -> authorize
//                        .antMatchers("/api/auth/**")
//                        .permitAll()
//                        .antMatchers("**")
//                        .permitAll()
//                        .antMatchers(HttpMethod.GET, "/api/subreddit")
//                        .permitAll()
//                        .antMatchers(HttpMethod.GET, "/api/posts/")
//                        .permitAll()
//                        .antMatchers(HttpMethod.GET, "/api/posts/**")
//                        .permitAll()
//                        .antMatchers("/v2/api-docs",
//                                "/configuration/ui",
//                                "/swagger-resources/**",
//                                "/configuration/security",
//                                "/swagger-ui.html",
//                                "/webjars/**")
//                        .permitAll()
//                        .anyRequest()
//                        .authenticated());
//
//    }




    }
    //    @Override
//    protected void configure(HttpSecurity http) throws Exception {
//        http.cors().and().csrf().disable();
//
//        http.authorizeRequests().antMatchers(
//                        "/registration/**",
//                        "/user**",
//                        "/**",
//                        "/js/**",
//                        "/css/**",
//                        "**",
//                        "/*.js", "/**.js",
//                        "js.stripe.com/v3/",
//                        "/api/**",
//                        "/img/**").permitAll()
//                .anyRequest().authenticated()
//                .and()
//                .formLogin()
//                .loginPage("/user/signin")
//                .permitAll()
//                .and()
//                .logout()
//                .invalidateHttpSession(true)
//                .clearAuthentication(true)
//                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
//                .logoutSuccessUrl("/user/signin?logout")
//                .permitAll();
//    }

