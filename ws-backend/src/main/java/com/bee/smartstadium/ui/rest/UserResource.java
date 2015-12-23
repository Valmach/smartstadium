package com.bee.smartstadium.ui.rest;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by BZ02973 on 23.12.2015.
 */
@RestController
public class UserResource {

    @RequestMapping("/user")
    public Map<String, Object> user(Principal user) {
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        map.put("name", user.getName());
        map.put("roles", AuthorityUtils.authorityListToSet(((Authentication) user)
                .getAuthorities()));
        return map;
    }
}
