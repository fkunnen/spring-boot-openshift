package org.fkunnen.springbootopenshift.dbtest;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dbtest")
public class DbTestController {
    @Autowired
    TestRepository repository;

    @GetMapping
    public ResponseEntity getNames() {
        return new ResponseEntity(repository.findAll(), HttpStatus.OK);
    }
}
